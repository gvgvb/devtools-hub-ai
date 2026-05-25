import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Trash2, Braces, Share2, History } from 'lucide-react';
import { useToast } from './ToastContext';

export const JSONFormatter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState(() => {
    const data = searchParams.get('data');
    if (!data) return '';
    try {
      return decodeURIComponent(atob(data));
    } catch (e) {
      return '';
    }
  });
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('json_history');
      const parsed = saved ? JSON.parse(saved) : [];
      setHistory(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []);
    } catch (error) {
      setHistory([]);
    }
    setHistoryLoaded(true);
  }, []);

  useEffect(() => {
    if (historyLoaded && input) {
      handleFormat();
    }
  }, [historyLoaded, input]);

  const handleFormat = (minify = false) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setError('');

      setHistory((currentHistory) => {
        const newHistory = [input, ...currentHistory.filter((item) => item !== input)].slice(0, 5);
        try {
          localStorage.setItem('json_history', JSON.stringify(newHistory));
        } catch (storageError) {
          // Formatting should still work if the browser refuses local storage.
        }
        return newHistory;
      });
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  };

  const shareLink = async () => {
    try {
      const encoded = btoa(encodeURIComponent(input));
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      setSearchParams({ data: encoded });

      if (navigator.share) {
        try {
          await navigator.share({ title: 'JSON Formatter', text: 'Check this JSON', url });
          showToast('Shared via native share', 'success');
          return;
        } catch (err) {
          // user cancelled or share failed, fall back to clipboard
        }
      }

      const { writeToClipboard } = await import('./clipboard');
      const ok = await writeToClipboard(url);
      if (ok) showToast('Share link copied to clipboard!', 'success');
      else showToast('Share failed', 'error');
    } catch (e) {
      showToast('Share failed', 'error');
    }
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (output) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(output);
          if (ok) showToast('JSON copied to clipboard via shortcut', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(output)
  );

  return (
    <ToolShell
      title="JSON Formatter & Validator"
      description="Beautify, validate and minify JSON code online with real-time feedback."
      path="/tools/json"
      icon={Braces}
      iconColor="bg-blue-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Input</span>
            <button onClick={() => setInput('')} aria-label="Clear JSON input" className="text-slate-500 hover:text-red-400 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
            placeholder="Paste your messy JSON here..."
          />
          <div className="flex gap-3">
            <button onClick={() => handleFormat(false)} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20">Beautify</button>
            <button onClick={() => handleFormat(true)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all">Minify</button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Output</span>
            <div className="flex flex-wrap gap-3">
              {input && (
                <button onClick={shareLink} aria-label="Share JSON input" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:opacity-80 transition-colors">
                  <Share2 size={18} />
                  <span className="text-xs font-bold uppercase">Share</span>
                </button>
              )}
              {output && (
                <CopyButton value={output} label="Copy output" />
              )}
            </div>
          </div>
          <div className={`flex-1 bg-slate-950 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl p-4 font-mono text-sm overflow-auto relative group`}>
            {error ? <div className="text-red-400 bg-red-400/10 p-4 rounded-lg">{error}</div> : <pre className="text-blue-300">{output}</pre>}
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-12 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><History size={20} className="text-blue-500" /> Recent Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {history.map((h, i) => (
              <button key={i} onClick={() => setInput(h)} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-400 truncate hover:border-blue-500 transition-all text-left">
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </ToolShell>
  );
};
