const fs = require('fs');
const path = require('path');
const { baseUrl, routes, urlFor } = require('./seo-routes.cjs');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const lastmod = new Date().toISOString().slice(0, 10);

fs.mkdirSync(publicDir, { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url><loc>${urlFor(route.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');

console.log(`Generated public/sitemap.xml with ${routes.length} URLs.`);
console.log('Generated public/robots.txt.');
