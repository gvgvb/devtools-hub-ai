import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Sparkles, ChevronDown, Star } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { ToastProvider } from './ToastContext';
import { tools } from './toolsData';

const readFavoritePaths = () => {
  try {
    const storedFavorites = localStorage.getItem('favorite_tools');
    const parsed = storedFavorites ? JSON.parse(storedFavorites) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch (error) {
    return [];
  }
};

export const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [favoritePaths, setFavoritePaths] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    if (location.hash) {
      const timeoutId = window.setTimeout(() => {
        const rawTargetId = location.hash.slice(1);
        const targetId = (() => {
          try {
            return decodeURIComponent(rawTargetId);
          } catch (error) {
            return rawTargetId;
          }
        })();
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
      return () => window.clearTimeout(timeoutId);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location]);

  useEffect(() => {
    const refreshFavorites = () => setFavoritePaths(readFavoritePaths());
    refreshFavorites();
    window.addEventListener('storage', refreshFavorites);
    window.addEventListener('zyphoric:favorites-updated', refreshFavorites);
    return () => {
      window.removeEventListener('storage', refreshFavorites);
      window.removeEventListener('zyphoric:favorites-updated', refreshFavorites);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const favoriteTools = useMemo(
    () => favoritePaths.map((path) => tools.find((tool) => tool.path === path)).filter(Boolean) as typeof tools,
    [favoritePaths]
  );

  return (
    <ToastProvider>
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col transition-colors duration-300">
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 rounded-lg text-xl font-bold transition hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950">
            <img src="/zyphoric-favicon.svg" alt="" className="h-8 w-8 rounded-lg shadow-sm shadow-blue-950/20" />
            <span>Zyphoric</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-300">
            <div className="relative group">
              <button className="flex items-center gap-1 rounded-lg py-2 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 transition" aria-haspopup="true">
                Tools <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all py-2 z-50">
                {tools
                  .filter((tool) => tool.category === 'Standard')
                  .slice(0, 5)
                  .map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-4 py-2 hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:outline-none dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800 transition"
                    >
                      {tool.name}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 rounded-lg py-2 hover:text-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 transition" aria-haspopup="true">
                AI Lab <Sparkles size={14} className="text-emerald-500" />
              </button>
              <div className="absolute top-full left-0 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all py-2 z-50">
                {tools
                  .filter((tool) => tool.category === 'AI')
                  .slice(0, 5)
                  .map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-4 py-2 hover:bg-emerald-50 focus-visible:bg-emerald-50 focus-visible:outline-none dark:hover:bg-emerald-900/20 dark:focus-visible:bg-emerald-900/20 transition"
                    >
                      {tool.name}
                    </Link>
                  ))}
              </div>
            </div>
            <Link to="/articles" className="py-2 px-3 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
              Guides
            </Link>
            <Link to="/about" className="py-2 hover:text-blue-500 transition">
              About
            </Link>
            <Link to="/contact" className="py-2 hover:text-blue-500 transition">
              Contact
            </Link>
            <button onClick={() => setIsDark(!isDark)} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className="p-2 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950 rounded-lg transition">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setIsDark(!isDark)} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className="p-2 rounded-lg transition">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-200 shadow-xl max-h-[80vh] overflow-y-auto" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-3">
              {tools.slice(0, 9).map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {tool.name}
                </Link>
              ))}
              <Link
                to="/articles"
                className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 transition"
              >
                Guides
              </Link>
              <Link
                to="/about"
                className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="rounded-2xl border border-slate-200 dark:border-slate-800 p-3 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Contact
              </Link>
            </div>
            {favoriteTools.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">Favorites</p>
                <div className="grid grid-cols-2 gap-2">
                  {favoriteTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="rounded-2xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-100 transition"
                    >
                      <Star size={14} className="inline-block mr-2" />
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-12 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800/50 py-10 px-4 sm:px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[1.2fr_1.8fr] items-start">
          <div className="space-y-4 text-slate-500 dark:text-slate-300 text-sm">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white hover:text-blue-500 transition">
              <img src="/zyphoric-favicon.svg" alt="" className="h-7 w-7 rounded-lg" />
              <span>Zyphoric</span>
            </Link>
            <p>© {new Date().getFullYear()} Zyphoric. Browser-native developer utilities for formatting, decoding, and AI-enhanced workflows.</p>
            <p>Most standard tools run locally in your browser. AI tools use a secure API connection only when you submit a prompt.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 text-sm text-slate-500 dark:text-slate-300">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Top tools</h3>
              <div className="flex flex-col gap-2">
                {tools.slice(0, 4).map((tool) => (
                  <Link key={tool.path} to={tool.path} className="hover:text-blue-500 transition">
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Explore</h3>
              <div className="flex flex-col gap-2">
                <Link to="/" className="hover:text-blue-500 transition">Home</Link>
                <Link to="/articles" className="hover:text-blue-500 transition">Guides</Link>
                <Link to="/#tools" className="hover:text-blue-500 transition">Browse tools</Link>
                <Link to="/about" className="hover:text-blue-500 transition">About</Link>
                <Link to="/contact" className="hover:text-blue-500 transition">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Legal</h3>
              <div className="flex flex-col gap-2">
                <Link to="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-blue-500 transition">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </ToastProvider>
  );
};
