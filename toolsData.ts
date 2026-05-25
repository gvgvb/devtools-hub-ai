import rawTools from './tools.json';

type ToolEntry = typeof rawTools.tools[number] & {
  featured?: boolean;
  trending?: boolean;
  latest?: boolean;
  image?: string;
  examples?: string[];
  useCases?: string[];
  relatedArticles?: Array<{ title: string; href: string }>;
};

type SiteData = typeof rawTools.site;

const configuredBaseUrl = (import.meta.env.VITE_SITE_URL || rawTools.site.baseUrl).replace(/\/$/, '');

export const site = { ...rawTools.site, baseUrl: configuredBaseUrl } as SiteData;
export const tools = rawTools.tools as ToolEntry[];
export const globalFaqs = rawTools.faqs as { q: string; a: string }[];
const defaultImage = `${site.baseUrl}/zyphoric-og-image.png`;
const logoImage = `${site.baseUrl}/zyphoric-icon-512.png`;

export const toolByPath = (path: string) => tools.find((tool) => tool.path === path);

const splitKeywords = (keywords?: string) =>
  keywords?.split(',').map((keyword) => keyword.trim().toLowerCase()) ?? [];

export const relatedTools = (currentPath: string, limit = 3) => {
  const current = toolByPath(currentPath);
  if (!current) return tools.slice(0, limit);

  const currentKeywords = splitKeywords(current.keywords);

  return tools
    .filter((tool) => tool.path !== currentPath)
    .map((tool) => {
      const keywords = splitKeywords(tool.keywords);
      const sharedKeywords = keywords.filter((keyword) => currentKeywords.includes(keyword)).length;
      const score =
        (tool.category === current.category ? 8 : 0) +
        sharedKeywords * 3 +
        (tool.featured ? 1 : 0);
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, limit)
    .map(({ tool }) => tool);
};

export const faqSchemaForTool = (tool: ToolEntry) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: tool.faqs?.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })) ?? [],
});

export const breadcrumbSchema = (path: string, label: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${site.baseUrl}/`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: label,
      item: `${site.baseUrl}${path}`,
    },
  ],
});

export type { ToolEntry };

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${site.baseUrl}/#organization`,
  name: site.name,
  url: `${site.baseUrl}/`,
  logo: logoImage,
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.baseUrl}/#website`,
  name: site.name,
  url: `${site.baseUrl}/`,
  publisher: {
    '@id': `${site.baseUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: `${site.baseUrl}/?q={search_term_string}`,
    queryInput: 'required name=search_term_string',
  },
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${site.baseUrl}/#software`,
  name: site.name,
  description: 'Browser-native developer utilities for formatting, decoding, debugging, converting, and AI-assisted code workflows.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: `${site.baseUrl}/`,
  image: defaultImage,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@id': `${site.baseUrl}/#organization`,
  },
};

export const pageSchema = (title: string, description: string, path: string, tool?: ToolEntry) => {
  const schema: object[] = [
    organizationSchema,
    websiteSchema,
    softwareApplicationSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `${site.baseUrl}${path}`,
      isPartOf: {
        '@id': `${site.baseUrl}/#website`,
      },
      publisher: {
        '@id': `${site.baseUrl}/#organization`,
      },
    },
  ];

  if (tool) {
    schema.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': `${site.baseUrl}${tool.path}#software`,
      name: tool.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      url: `${site.baseUrl}${tool.path}`,
      description: tool.seoDescription || tool.desc,
      image: defaultImage,
      isPartOf: {
        '@id': `${site.baseUrl}/#software`,
      },
      publisher: {
        '@id': `${site.baseUrl}/#organization`,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }

  if (tool?.faqs?.length) {
    schema.push(faqSchemaForTool(tool));
  }

  schema.push(breadcrumbSchema(path, title));
  return schema.length === 1 ? schema[0] : schema;
};
