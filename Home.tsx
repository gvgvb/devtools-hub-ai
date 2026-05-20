import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Braces, Sparkles, Zap, LayoutPanelTop, HelpCircle, Search, ArrowRight, Star, AlertTriangle } from 'lucide-react';
import { SEO } from './SEO';
import { site, tools, globalFaqs } from './toolsData';
import { useKeyboardShortcut } from './useKeyboardShortcut';

const featuredTools = tools.filter((tool) => tool.featured).slice(0, 4);
const trendingTools = tools.filter((tool) => tool.trending).slice(0, 4);
const latestTools = tools.filter((tool) => tool.latest).slice(0, 4);
const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'DevTools Hub AI — AI-powered developer tools',
    description: 'A modern suite of AI-powered developer utilities for formatting, decoding, debugging, and transforming code locally in your browser.',
    url: `${site.baseUrl}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${site.baseUrl}/?q={search_term_string}`,
      queryInput: 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: globalFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  },
];

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedRecent = localStorage.getItem('recent_tools');
    if (savedRecent) setRecentTools(JSON.parse(savedRecent));
    const savedFavorites = localStorage.getItem('favorite_tools');
    if (savedFavorites) setFavoriteTools(JSON.parse(savedFavorites));
  }, []);

  useKeyboardShortcut({ key: 'k', ctrl: true }, () => {
    searchRef.current?.focus();
  });

  useKeyboardShortcut({ key: '/', shift: true }, () => {
    searchRef.current?.focus();
  });

  const trackToolUsage = (path: string) => {
    setRecentTools((current) => {
      const updated = [path, ...current.filter((item) => item !== path)].slice(0, 4);
      localStorage.setItem('recent_tools', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (path: string) => {
    setFavoriteTools((current) => {
      const updated = current.includes(path)
        ? current.filter((item) => item !== path)
        : [path, ...current].slice(0, 4);
      localStorage.setItem('favorite_tools', JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteToolCards = favoriteTools
    .map((path) => tools.find((tool) => tool.path === path))
    .filter(Boolean) as typeof tools;

  const filteredTools = tools.filter((tool) => {
    const query = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.desc.toLowerCase().includes(query) ||
      tool.keywords?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-full space-y-24 pb-20">
      <SEO
        title="Professional Developer Tools"
        description="Use browser-first developer tools for JSON formatting, JWT decoding, regex testing, SQL formatting, Base64 conversion, and AI-assisted code workflows."
        canonical={`${site.baseUrl}/`}
        schema={homeSchema}
        keywords="developer tools, ai developer tools, online json formatter, jwt decoder, regex tester, sql formatter"
      />

      <section className="w-full max-w-full overflow-hidden text-center space-y-8 pt-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium animate-fade-in">
          <Zap size={16} />
          <span>Supercharged by AI Llama 3.1</span>
        </div>
        <h1 className="mx-auto max-w-full text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight">
          The Ultimate <span className="block sm:inline bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent">Developer Hub</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          A professional suite of tools designed to help engineers format, decode, refactor, and understand code faster—without leaving the browser.
        </p>
        <div className="w-full max-w-xl mx-auto relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search for a tool (e.g. JWT, AI, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tools"
            className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-lg"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        {featuredTools.length > 0 ? featuredTools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            onClick={() => trackToolUsage(tool.path)}
            className="group p-8 rounded-[2rem] bg-slate-900/90 border border-slate-800 shadow-2xl shadow-slate-950/20 hover:border-blue-500/50 hover:bg-slate-800 transition-all"
          >
            <div className="text-sm uppercase tracking-[0.3em] text-slate-300 mb-4">{tool.category}</div>
            <h2 className="text-2xl font-bold text-white mb-3">{tool.name}</h2>
            <p className="text-slate-400 leading-relaxed">{tool.desc}</p>
            <div className="mt-8 inline-flex items-center gap-2 text-blue-400 font-semibold">
              Explore
              <ArrowRight size={18} />
            </div>
          </Link>
        )) : (
          <div className="p-8 rounded-[2rem] bg-slate-900/90 border border-slate-800 shadow-2xl shadow-slate-950/20 flex items-center justify-center text-slate-400">
            No featured tools are configured yet. Explore all tools below to get started.
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400 mb-3">Trending now</p>
          <h2 className="text-3xl font-bold text-white mb-6">Popular developer utilities</h2>
          <div className="space-y-4">
            {trendingTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                onClick={() => trackToolUsage(tool.path)}
                className="block rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50 hover:bg-slate-800 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{tool.category}</p>
                    <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                  </div>
                  <ArrowRight size={20} className="text-blue-400" />
                </div>
                <p className="text-slate-400 mt-3 leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400 mb-3">Latest tools</p>
          <h2 className="text-3xl font-bold text-white mb-6">New additions</h2>
          <div className="space-y-4">
            {latestTools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                onClick={() => trackToolUsage(tool.path)}
                className="block rounded-3xl border border-slate-800 bg-slate-900 p-6 hover:border-blue-500/50 hover:bg-slate-800 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{tool.category}</p>
                    <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                  </div>
                  <ArrowRight size={20} className="text-blue-400" />
                </div>
                <p className="text-slate-400 mt-3 leading-relaxed">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-blue-500/10 bg-blue-500/5 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-blue-400 mb-3">Build better workflows</p>
        <h2 className="text-4xl font-bold text-slate-950 mb-4">Learn how to use the tools like a pro</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Browse productivity guides, implementation patterns, and the best way to combine DevTools Hub AI utilities for API debugging, encryption, regex validation, and more.
        </p>
        <Link to="/articles" className="inline-flex mt-8 items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl transition-shadow shadow-lg shadow-blue-600/20">
          View guides and articles
          <ArrowRight size={18} />
        </Link>
      </section>

      {favoriteToolCards.length > 0 ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Favorites</p>
              <h2 className="text-3xl font-bold">Your favorite tools</h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-300">Quick access to tools you use most often.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {favoriteToolCards.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                onClick={() => trackToolUsage(tool.path)}
                className="group p-5 rounded-3xl border border-slate-800 bg-slate-950/70 hover:border-blue-500/50 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-300">{tool.category}</span>
                  <Star size={18} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                <p className="text-slate-400 text-sm mt-3">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-6 rounded-[3rem] border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Favorites</p>
          <h2 className="text-3xl font-bold">Save tools for even faster access</h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Star the tools you use most often and they will appear here for instant access on your next visit.
          </p>
          <Link to="/tools/json" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl transition">
            Explore JSON Formatter
            <ArrowRight size={18} />
          </Link>
        </section>
      )}

      {searchQuery === '' && (
        <section className="animate-fade-in">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">Recently used</p>
              <h2 className="text-3xl font-bold">Continue where you left off</h2>
            </div>
            {recentTools.length > 0 ? (
              <button onClick={() => {
                setRecentTools([]);
                localStorage.removeItem('recent_tools');
              }} className="text-sm text-slate-500 hover:text-blue-500 transition">
                Clear history
              </button>
            ) : null}
          </div>

          {recentTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {recentTools.map((path) => {
                const tool = tools.find((t) => t.path === path);
                if (!tool) return null;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => trackToolUsage(tool.path)}
                    className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3"
                  >
                    <Sparkles size={18} className="text-blue-400" />
                    <span className="text-sm font-medium text-slate-100">{tool.name}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[3rem] border border-dashed border-slate-700 bg-slate-900/80 p-10 text-center">
              <p className="text-slate-400 mb-4">No recent tools yet.</p>
              <h3 className="text-2xl font-bold mb-4">Start with a tool for your next task</h3>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link to="/tools/json" onClick={() => trackToolUsage('/tools/json')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white transition">
                  JSON Formatter
                </Link>
                <Link to="/tools/regex" onClick={() => trackToolUsage('/tools/regex')} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-3xl border border-slate-700 text-slate-100 hover:bg-slate-800 transition">
                  Regex Tester
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      <section id="tools" className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">All tools</p>
            <h2 className="text-3xl font-bold">Build faster with the right utility</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-300 max-w-xl">
            Search and jump to the tool you need, from JSON formatting to AI-assisted code conversion.
          </p>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
            <AlertTriangle className="mx-auto text-slate-700 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-500">No tools match your search</h3>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-500 hover:underline">Clear search</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                onClick={() => trackToolUsage(tool.path)}
                className="group h-full flex flex-col p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6 gap-3">
                  <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl w-fit transition-shadow shadow-sm group-hover:shadow-md">
                    {tool.category === 'AI' ? <Sparkles size={28} className="text-emerald-400" /> : <Braces size={28} className="text-slate-700 dark:text-slate-200" />}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleFavorite(tool.path);
                    }}
                    className="rounded-full p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    aria-label={favoriteTools.includes(tool.path) ? `Remove ${tool.name} from favorites` : `Add ${tool.name} to favorites`}
                  >
                    <Star size={18} className={favoriteTools.includes(tool.path) ? 'text-amber-400' : ''} />
                  </button>
                  {tool.category === 'AI' && (
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-md border border-emerald-500/20">AI</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">{tool.name}</h3>
                <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed">{tool.desc}</p>
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap size={16} className="text-blue-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="text-center py-20 bg-gradient-to-b from-transparent to-blue-500/5 rounded-[3rem] border border-blue-500/10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold">Ready to boost your productivity?</h2>
          <p className="text-slate-400">All tools are free, open source, and run entirely in your browser.</p>
          <Link to="/tools/json" className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/20">
            Start using for free
          </Link>
        </div>
      </section>

      <section className="bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50 rounded-[3rem] p-12 md:p-20 overflow-hidden relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Fast. Private. <br /> Open Source.</h2>
            <p className="text-slate-400 text-lg">
              We don't store your data. Every formatting and decoding process happens locally in your browser.
              AI tools use high-speed encrypted channels to provide instant feedback.
            </p>
            <ul className="space-y-4">
              {['No Account Required', 'PWA Support (Offline)', 'Zero Tracking'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-200 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative flex justify-center">
            <div className="w-full h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl absolute -z-10 animate-pulse" />
            <LayoutPanelTop size={200} className="text-slate-800/50" />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <HelpCircle className="mx-auto text-blue-500" size={40} />
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="grid gap-6">
          {globalFaqs.map((faq, i) => (
            <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
