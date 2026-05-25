import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { askAI } from './aiService';
import { Code2, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const RegexGenerator = () => {
  const [description, setDescription] = useState('');
  const [regex, setRegex] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (!description) return;
    setError('');
    setLoading(true);
    try {
      const result = await askAI(
        `Generate a regular expression for this requirement: "${description}". Provide ONLY the regex string and a brief explanation.`,
        "You are a regex expert. Output the regex in a code block."
      );
      setRegex(result);
    } catch (err) {
      setRegex('');
      setError('Unable to generate regex. Please try again later.');
      showToast('Regex generation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!regex) return;
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(regex);
        if (ok) showToast('Regex copied to clipboard!', 'success');
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

  return (
    <ToolShell
      title="AI Regex Generator"
      description="Generate complex regular expressions from plain English descriptions."
      path="/ai/regex-gen"
      icon={Code2}
      iconColor="bg-orange-500"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Regex requirement description"
          className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none mb-4"
          placeholder="e.g., Match a strong password with at least one uppercase letter and one symbol..."
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !description}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? 'Generating...' : 'Generate Regex'}
        </button>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>

      {regex ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-orange-400">Result</h3>
            <CopyButton value={regex} label="Copy regex" />
          </div>
          <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap font-mono bg-slate-950 p-4 rounded-xl">
            {regex}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-800 bg-slate-950/80 p-8 text-slate-500 text-center">
          Describe your regex requirement and generate a pattern here.
        </div>
      )}
    </ToolShell>
  );
};
