const fs = require('fs');
const path = require('path');
const {
  baseUrl,
  ogImage,
  socialImage,
  routes,
  notFoundRoute,
  urlFor,
  withBrand,
  schemaForRoute,
} = require('./seo-routes.cjs');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html was not found. Run vite build before static page generation.');
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const stripManagedSeo = (html) =>
  html
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name="robots"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name="keywords"[^>]*>\s*/gi, '\n')
    .replace(/\s*<link\s+rel="canonical"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '\n')
    .replace(/\s*<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, '\n')
    .replace(/\s*<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi, '\n');

const fallbackContent = (route) => {
  const title = route.tool?.name || route.title;
  const related = routes
    .filter((item) => item.path !== route.path && item.path !== '/')
    .slice(0, 6);

  const faqHtml = route.tool?.faqs?.length
    ? `<section class="mt-10 space-y-4"><h2 class="text-2xl font-bold text-slate-950 dark:text-white">Frequently asked questions</h2>${route.tool.faqs
        .map(
          (faq) =>
            `<article class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><h3 class="font-semibold text-slate-950 dark:text-white">${escapeHtml(
              faq.q
            )}</h3><p class="mt-2 text-slate-600 dark:text-slate-400">${escapeHtml(faq.a)}</p></article>`
        )
        .join('')}</section>`
    : '';

  return `<main class="mx-auto max-w-5xl px-6 py-12 text-slate-900 dark:text-slate-100">
    <p class="text-sm font-semibold uppercase tracking-widest text-blue-500">Zyphoric</p>
    <h1 class="mt-4 text-4xl font-bold">${escapeHtml(title)}</h1>
    <p class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">${escapeHtml(
      route.description
    )}</p>
    ${
      route.tool
        ? `<section class="mt-10 grid gap-4 sm:grid-cols-3"><div class="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"><h2 class="font-semibold">Category</h2><p class="mt-2 text-slate-600 dark:text-slate-400">${escapeHtml(
            route.tool.category
          )}</p></div><div class="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"><h2 class="font-semibold">Privacy</h2><p class="mt-2 text-slate-600 dark:text-slate-400">Runs in your browser when possible.</p></div><div class="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"><h2 class="font-semibold">Workflow</h2><p class="mt-2 text-slate-600 dark:text-slate-400">Format, inspect, convert, or debug faster.</p></div></section>`
        : ''
    }
    ${faqHtml}
    <section class="mt-10"><h2 class="text-2xl font-bold text-slate-950 dark:text-white">Related pages</h2><div class="mt-4 grid gap-3 sm:grid-cols-2">${related
      .map(
        (item) =>
          `<a class="rounded-xl border border-slate-200 px-4 py-3 text-blue-600 dark:border-slate-800 dark:text-blue-300" href="${item.path}">${escapeHtml(
            item.tool?.name || item.title
          )}</a>`
      )
      .join('')}</div></section>
  </main>`;
};

const seoBlock = (route) => {
  const title = withBrand(route.title);
  const canonical = route.path === '/404' ? urlFor('/') : urlFor(route.path);
  const schema = schemaForRoute(route);
  const robots = route.robots || 'index, follow, max-image-preview:large';
  const keywords = route.keywords ? `    <meta name="keywords" content="${escapeHtml(route.keywords)}" />\n` : '';

  return `    <title>${escapeHtml(title)}</title>
    <meta name="application-name" content="Zyphoric" />
    <meta name="apple-mobile-web-app-title" content="Zyphoric" />
    <meta name="description" content="${escapeHtml(route.description)}" />
    <meta name="robots" content="${escapeHtml(robots)}" />
${keywords}    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:site_name" content="Zyphoric" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Zyphoric preview image" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${escapeHtml(canonical)}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${socialImage}" />
    <meta name="twitter:image:alt" content="Zyphoric preview image" />
    <script type="application/ld+json" data-seo-schema="true">${JSON.stringify(schema)}</script>`;
};

const renderPage = (route) => {
  const html = stripManagedSeo(template)
    .replace('</head>', `\n${seoBlock(route)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${fallbackContent(route)}</div>`);
  return html;
};

const outputFilesForRoute = (routePath) => {
  if (routePath === '/') return [path.join(distDir, 'index.html')];
  const cleanPath = routePath.replace(/^\//, '');
  return [
    path.join(distDir, cleanPath, 'index.html'),
    path.join(distDir, `${cleanPath}.html`),
  ];
};

for (const route of routes) {
  for (const outputFile of outputFilesForRoute(route.path)) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, renderPage(route), 'utf8');
  }
}

fs.writeFileSync(path.join(distDir, '404.html'), renderPage(notFoundRoute), 'utf8');

console.log(`Generated static HTML for ${routes.length} canonical routes and 404.html.`);
