import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: object;
  image?: string;
  keywords?: string;
  robots?: string;
}

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const removeMetaTag = (attr: 'name' | 'property', key: string) => {
  const element = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (element) element.remove();
};

const setLinkTag = (rel: string, href: string) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const removeManagedSchemaScripts = () => {
  document.head
    .querySelectorAll('script[data-seo-schema]')
    .forEach((element) => element.remove());
};

export const SEO = ({ title, description, canonical, schema, image, keywords, robots }: SEOProps) => {
  useEffect(() => {
    const pageTitle = title.includes('DevTools Hub AI') ? title : `${title} | DevTools Hub AI`;
    const resolvedImage = image
      ? new URL(image, window.location.origin).toString()
      : new URL('/icon-512.png', window.location.origin).toString();
    document.title = pageTitle;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'theme-color', '#0f172a');
    setMetaTag('name', 'robots', robots ?? 'index, follow');
    if (keywords) setMetaTag('name', 'keywords', keywords);
    else removeMetaTag('name', 'keywords');
    if (canonical) setLinkTag('canonical', canonical);

    const pageUrl = canonical ?? window.location.href;
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:site_name', 'DevTools Hub AI');
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:image', resolvedImage);
    setMetaTag('property', 'og:image:alt', 'DevTools Hub AI preview image');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@DevToolsHubAI');
    setMetaTag('name', 'twitter:creator', '@DevToolsHubAI');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', resolvedImage);
    setMetaTag('name', 'twitter:image:alt', 'DevTools Hub AI preview image');

    removeManagedSchemaScripts();
    if (schema) {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, schema, image, keywords, robots]);

  return null;
};
