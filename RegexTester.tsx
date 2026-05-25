import { useState, useEffect } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Code2, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const RegexTester = () => {
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const copyRegex = () => {
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(regex);
        if (ok) showToast('Regex pattern copied!', 'success');
        else showToast('Copy failed', 'error');
      } catch (e) {
        showToast('Copy failed', 'error');
      }
    })();
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (regex) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(regex);
          if (ok) showToast('Regex copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(regex)
  );

  useEffect(() => {
    if (!regex) {
      setMatches([]);
      setError('');
      return;
    }
    try {
      const normalizedFlags = flags.includes('g') ? flags : `${flags}g`;
      const re = new RegExp(regex, normalizedFlags);
      const allMatches = Array.from(text.matchAll(re));
      setMatches(allMatches);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [regex, flags, text]);

  return (
    <ToolShell
      title="Regex Tester"
      description="Live Regex testing with highlighting and match groups."
      path="/tools/regex"
      icon={Code2}
      iconColor="bg-orange-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
          <Code2 size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Regex Tester</h2>
          <p className="text-slate-400">Validate and test your regular expressions in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-400 block uppercase">Regular Expression</label>
                {regex && (
                  <CopyButton value={regex} label="Copy regex" />
                )}
              </div>
              <input
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                className={`w-full bg-slate-950 border ${error ? 'border-red-500' : 'border-slate-800'} rounded-xl p-4 font-mono text-orange-400 outline-none focus:ring-2 focus:ring-orange-500`}
                placeholder="^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$"
              />
            </div>
            <div className="w-full md:w-32">
              <label className="text-sm font-medium text-slate-400 mb-2 block uppercase">Flags</label>
              <input
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-slate-300 outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="gim"
              />
            </div>
          </div>
          {error && <div className="text-red-400 flex items-center gap-2 text-sm"><AlertCircle size={14} /> {error}</div>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400 uppercase px-2">Test String</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-slate-300 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              placeholder="Enter text to test here..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400 uppercase px-2">Matches ({matches.length})</label>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm overflow-auto">
              {matches.map((match, i) => (
                <div key={i} className="mb-2 p-2 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                  <span className="text-orange-500 font-bold mr-2">Match {i + 1}:</span>
                  <span className="text-slate-300 underline decoration-orange-500/50">{match[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
