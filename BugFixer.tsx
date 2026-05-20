import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { askAI } from './aiService';
import { Bug, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const BugFixer = () => {
  const [code, setCode] = useState('');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [error, setError] = useState('');

  const handleFix = async () => {
    if (!code) return;
    setLoading(true);
    setError('');
    setSolution('');
    try {
      const result = await askAI(
        `Identify the bugs in the following code and provide a fixed version with explanations:\n\n${code}`,
        "You are an expert debugger. Provide the fixed code first, then the explanation."
      );
      setSolution(result);
    } catch (err) {
      setError('Unable to fix the code. Please try again.');
      showToast('Bug fixer failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (solution) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(solution);
          if (ok) showToast('Solution copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(solution)
  );

  return (
    <ToolShell
      title="AI Bug Fixer"
      description="Find and fix bugs in your code instantly using AI."
      path="/ai/bug-fixer"
      icon={Bug}
      iconColor="bg-red-500"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-red-500/10 rounded-2xl text-red-500 mb-2">
          <Bug size={32} />
        </div>
        <h2 className="text-4xl font-bold text-white">AI Bug Fixer</h2>
        <p className="text-slate-400">Paste your buggy code and let the AI perform surgery on it.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-red-300 focus:ring-2 focus:ring-red-500 outline-none resize-none mb-4"
          placeholder="// Paste buggy code here..."
        />
        <button
          onClick={handleFix}
          disabled={loading || !code}
          className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? 'Debugging...' : 'Fix My Code'}
        </button>
      </div>

      {error && (
        <div className="bg-slate-900 border border-red-500/20 rounded-3xl p-6 text-red-200">
          <h3 className="text-lg font-semibold text-red-300 mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {solution && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-emerald-400">Solution</h3>
            <CopyButton value={solution} label="Copy AI solution" onCopy={() => showToast('Solution copied!')} />
          </div>
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
            {solution}
          </div>
        </div>
      )}
    </ToolShell>
  );
};