import { Link } from 'react-router-dom';
import { ArrowRight, Braces, ShieldCheck, Sparkles } from 'lucide-react';
import { SEO } from './SEO';
import { site, tools } from './toolsData';

const description =
  'Learn about Zyphoric, a browser-first developer workspace for JSON formatting, JWT decoding, regex testing, SQL formatting, and AI-assisted code workflows.';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Zyphoric',
  description,
  url: `${site.baseUrl}/about`,
  mainEntity: {
    '@type': 'Organization',
    name: site.name,
    url: site.baseUrl,
  },
};

const highlights = [
  {
    icon: ShieldCheck,
    title: 'Local-first standard tools',
    text: 'Format, decode, compare, and convert common developer data directly in the browser whenever possible.',
  },
  {
    icon: Sparkles,
    title: 'Practical AI helpers',
    text: 'Use AI features for code explanation, bug-fixing suggestions, language conversion, and regex generation.',
  },
  {
    icon: Braces,
    title: 'Built for daily workflows',
    text: 'Jump between related utilities, guides, examples, and FAQs without leaving the developer context.',
  },
];

export const About = () => {
  return (
    <article className="mx-auto max-w-6xl space-y-12">
      <SEO
        title="About Zyphoric"
        description={description}
        canonical={`${site.baseUrl}/about`}
        schema={schema}
        keywords="about Zyphoric, developer tools, AI developer utilities, browser developer tools"
      />

      <header className="grid gap-8 border-b border-slate-200 pb-10 dark:border-slate-800 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">About</p>
          <h1 className="text-4xl font-bold text-slate-950 dark:text-white md:text-5xl">About Zyphoric</h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tool library</p>
          <p className="mt-3 text-4xl font-bold text-slate-950 dark:text-white">{tools.length}</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">developer utilities across standard and AI workflows</p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/80">
            <Icon size={28} className="text-blue-500" />
            <h2 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Why this exists</h2>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            Developers often switch between small utilities, docs, scripts, and AI chats just to inspect a payload or understand a snippet. Zyphoric brings those recurring tasks into one clean, linkable interface.
          </p>
          <p className="leading-relaxed text-slate-600 dark:text-slate-300">
            The product focuses on usefulness over noise: clear tool pages, practical examples, related links, and legal transparency for public launch.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">Start with a popular workflow</h2>
          <div className="mt-5 grid gap-3">
            {tools.slice(0, 5).map((tool) => (
              <Link key={tool.path} to={tool.path} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-slate-700 transition hover:border-blue-500 hover:text-blue-500 dark:border-slate-800 dark:text-slate-300 dark:hover:text-blue-400">
                <span>{tool.name}</span>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
