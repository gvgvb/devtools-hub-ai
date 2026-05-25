const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
try {
  require('dotenv').config({ path: path.join(root, '.env') });
} catch (error) {
  // dotenv is optional for build environments that provide variables directly.
}

const toolsPath = path.join(root, 'tools.json');
const data = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const site = data.site || {};
const siteName = site.name || 'Zyphoric';
const baseUrl = (process.env.SITE_URL || site.baseUrl || 'https://zyphoric.netlify.app').replace(/\/$/, '');
const ogImage = `${baseUrl}/zyphoric-og-image.png`;
const socialImage = `${baseUrl}/zyphoric-social-preview.png`;
const logoImage = `${baseUrl}/zyphoric-icon-512.png`;

const withBrand = (title) => (title.includes(siteName) ? title : `${title} | ${siteName}`);

const staticRoutes = [
  {
    path: '/',
    title: 'Professional Developer Tools',
    description:
      'Use browser-first developer tools for JSON formatting, JWT decoding, regex testing, SQL formatting, Base64 conversion, and AI-assisted code workflows.',
    keywords:
      'developer tools, ai developer tools, online json formatter, jwt decoder, regex tester, sql formatter',
    priority: '1.0',
    changefreq: 'weekly',
    type: 'WebPage',
  },
  {
    path: '/articles',
    title: 'Developer Guides & Articles',
    description:
      'Read practical developer guides for JWT debugging, JSON formatting, SQL cleanup, regex validation, and AI-assisted code review workflows.',
    keywords:
      'developer guides, coding best practices, ai developer tools, json formatting guide, jwt debugging',
    priority: '0.7',
    changefreq: 'monthly',
    type: 'CollectionPage',
  },
  {
    path: '/about',
    title: 'About Zyphoric',
    description:
      'Learn about Zyphoric, a browser-first developer workspace for JSON formatting, JWT decoding, regex testing, SQL formatting, and AI-assisted code workflows.',
    keywords:
      'about Zyphoric, developer tools, AI developer utilities, browser developer tools',
    priority: '0.6',
    changefreq: 'yearly',
    type: 'AboutPage',
  },
  {
    path: '/contact',
    title: 'Contact Zyphoric',
    description:
      'Contact Zyphoric for product support, privacy questions, bug reports, partnership requests, and general developer tool feedback.',
    keywords: 'contact Zyphoric, developer tools support, privacy contact, bug report',
    priority: '0.6',
    changefreq: 'yearly',
    type: 'ContactPage',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'Privacy Policy for Zyphoric, covering local browser processing, AI requests, limited service logs, and user choices.',
    keywords:
      'privacy policy, developer tool privacy, browser-based tools, AI tool privacy',
    priority: '0.5',
    changefreq: 'yearly',
    type: 'PrivacyPolicy',
  },
  {
    path: '/terms',
    title: 'Terms of Service',
    description:
      'Terms of Service for Zyphoric, including acceptable use, AI output review, service limits, advertising, and liability terms.',
    keywords: 'terms of service, acceptable use policy, developer tools terms, AI tools terms',
    priority: '0.5',
    changefreq: 'yearly',
    type: 'WebPage',
  },
];

const toolRoutes = (data.tools || []).map((tool) => ({
  path: tool.path,
  title: tool.seoTitle || tool.name,
  description: tool.seoDescription || tool.desc,
  keywords: tool.keywords || '',
  priority: tool.category === 'AI' ? '0.9' : '0.8',
  changefreq: 'monthly',
  type: 'WebApplication',
  tool,
}));

const notFoundRoute = {
  path: '/404',
  title: '404 - Page Not Found',
  description:
    'This page could not be found. Return home or jump directly to popular developer tools.',
  robots: 'noindex, follow',
  priority: '0.0',
  changefreq: 'yearly',
  type: 'WebPage',
};

const routes = [...staticRoutes.slice(0, 1), ...toolRoutes, ...staticRoutes.slice(1)];

const urlFor = (routePath) => `${baseUrl}${routePath === '/' ? '/' : routePath}`;

const breadcrumbSchema = (route) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${baseUrl}/`,
    },
    ...(route.path === '/'
      ? []
      : [
          {
            '@type': 'ListItem',
            position: 2,
            name: route.tool?.name || route.title,
            item: urlFor(route.path),
          },
        ]),
  ],
});

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: siteName,
  url: `${baseUrl}/`,
  logo: logoImage,
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: siteName,
  url: `${baseUrl}/`,
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${baseUrl}/?q={search_term_string}`,
    queryInput: 'required name=search_term_string',
  },
};

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${baseUrl}/#software`,
  name: siteName,
  description:
    'Browser-native developer utilities for formatting, decoding, debugging, converting, and AI-assisted code workflows.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: `${baseUrl}/`,
  image: ogImage,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@id': `${baseUrl}/#organization`,
  },
};

const schemaForRoute = (route) => {
  const page = {
    '@context': 'https://schema.org',
    '@type': route.type || 'WebPage',
    name: withBrand(route.title),
    description: route.description,
    url: urlFor(route.path),
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };

  const schema = [organizationSchema, websiteSchema, softwareApplicationSchema, page, breadcrumbSchema(route)];

  if (route.path === '/') {
    if (data.faqs?.length) {
      schema.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      });
    }
  }

  if (route.tool) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${urlFor(route.path)}#software`,
      name: route.tool.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: urlFor(route.path),
      description: route.description,
      image: ogImage,
      isPartOf: {
        '@id': `${baseUrl}/#software`,
      },
      publisher: {
        '@id': `${baseUrl}/#organization`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }

  if (route.tool?.faqs?.length) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.tool.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  return schema.length === 1 ? schema[0] : schema;
};

module.exports = {
  site,
  siteName,
  baseUrl,
  ogImage,
  socialImage,
  routes,
  notFoundRoute,
  urlFor,
  withBrand,
  schemaForRoute,
};
