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

export const site = rawTools.site as SiteData;
export const tools = rawTools.tools as ToolEntry[];
export const globalFaqs = rawTools.faqs as { q: string; a: string }[];

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

export const pageSchema = (title: string, description: string, path: string, tool?: ToolEntry) => {
  const schema: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: `${site.baseUrl}${path}`,
    },
  ];

  if (tool?.faqs?.length) {
    schema.push(faqSchemaForTool(tool));
  }

  schema.push(breadcrumbSchema(path, title));
  return schema.length === 1 ? schema[0] : schema;
};
