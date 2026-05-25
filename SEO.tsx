import { useEffect } from 'react';
import { site } from './toolsData';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  schema?: object | object[];
  image?: string;
  keywords?: string;
  robots?: string;
}

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  const elements = Array.from(document.head.querySelectorAll(`meta[${attr}="${key}"]`)) as HTMLMetaElement[];
  let element = elements[0] ?? null;
  elements.slice(1).forEach((duplicate) => duplicate.remove());

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const removeMetaTag = (attr: 'name' | 'property', key: string) => {
  document.head
    .querySelectorAll(`meta[${attr}="${key}"]`)
    .forEach((element) => element.remove());
};

const setLinkTag = (rel: string, href: string) => {
  const elements = Array.from(document.head.querySelectorAll(`link[rel="${rel}"]`)) as HTMLLinkElement[];
  let element = elements[0] ?? null;
  elements.slice(1).forEach((duplicate) => duplicate.remove());

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
    const siteName = site.name || 'Zyphoric';
    const pageTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    const pageUrl = canonical
      ? new URL(canonical, site.baseUrl).toString()
      : new URL(window.location.pathname, site.baseUrl).toString();
    const resolvedImage = image
      ? new URL(image, site.baseUrl).toString()
      : new URL('/zyphoric-og-image.png', site.baseUrl).toString();
    const resolvedSocialImage = image
      ? resolvedImage
      : new URL('/zyphoric-social-preview.png', site.baseUrl).toString();
    document.title = pageTitle;
    setMetaTag('name', 'application-name', siteName);
    setMetaTag('name', 'apple-mobile-web-app-title', siteName);
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'theme-color', '#0f2549');
    setMetaTag('name', 'color-scheme', 'dark light');
    setMetaTag('name', 'robots', robots ?? 'index, follow, max-image-preview:large');
    if (keywords) setMetaTag('name', 'keywords', keywords);
    else removeMetaTag('name', 'keywords');
    setLinkTag('canonical', pageUrl);

    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:locale', 'en_US');
    setMetaTag('property', 'og:image', resolvedImage);
    setMetaTag('property', 'og:image:secure_url', resolvedImage);
    setMetaTag('property', 'og:image:type', 'image/png');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', `${siteName} preview image`);

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    removeMetaTag('name', 'twitter:site');
    removeMetaTag('name', 'twitter:creator');
    setMetaTag('name', 'twitter:url', pageUrl);
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', resolvedSocialImage);
    setMetaTag('name', 'twitter:image:alt', `${siteName} preview image`);

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
