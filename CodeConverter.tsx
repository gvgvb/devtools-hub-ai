import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { askAI } from './aiService';
import { ArrowRightLeft, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const CodeConverter = () => {
  const [code, setCode] = useState('');
  const [targetLang, setTargetLang] = useState('Python');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleConvert = async () => {
    if (!code) return;
    setError('');
    setLoading(true);
    try {
      const output = await askAI(
        `Convert the following code to ${targetLang}. Keep the logic identical:\n\n${code}`,
        'You are an expert polyglot programmer. Provide only the converted code.'
      );
      setResult(output);
    } catch (err) {
      setResult('');
      setError('Conversion failed. Please try again or simplify the input.');
      showToast('Conversion failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(result);
        if (ok) showToast('Converted code copied!', 'success');
        else showToast('Copy failed', 'error');
      } catch (e) {
        showToast('Copy failed', 'error');
      }
    })();
  };

  return (
    <ToolShell
      title="AI Code Converter"
      description="Convert code between different programming languages instantly."
      path="/ai/converter"
      icon={ArrowRightLeft}
      iconColor="bg-blue-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-blue-100 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="// Paste source code here..."
          />
          <div className="flex gap-4 flex-col sm:flex-row">
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
              className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-3 outline-none border border-slate-700"
            >
              {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP'].map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <button
              onClick={handleConvert}
              disabled={loading || !code}
              className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
              {loading ? 'Converting...' : `Convert to ${targetLang}`}
            </button>
          </div>
          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm overflow-auto min-h-[465px] relative group">
          {result ? (
            <>
              <div className="absolute top-4 right-4">
                <CopyButton value={result} label="Copy converted code" onCopy={copyToClipboard} />
              </div>
              <pre className="whitespace-pre-wrap text-emerald-400">{result}</pre>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 italic gap-3">
              <p>Converted code will appear here.</p>
              <p className="text-xs text-slate-500">Enter source code and click convert.</p>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
};