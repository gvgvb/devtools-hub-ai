import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Hash, Trash2, ListChecks } from 'lucide-react';
import { useToast } from './ToastContext';

export const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isBatch, setIsBatch] = useState(false);
  const { showToast } = useToast();

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (output) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(output);
          if (ok) showToast('Base64 output copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(output)
  );

  // Unicode safe Base64
  const safeBtoa = (str: string) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
  const safeAtob = (str: string) => decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

  const encode = () => {
    try {
      if (isBatch) {
        const lines = input.split('\n');
        const encoded = lines.map(line => line ? safeBtoa(line) : '').join('\n');
        setOutput(encoded);
      } else {
        setOutput(safeBtoa(input));
      }
    } catch (e) {
      setOutput('Error: Invalid input for Base64 encoding');
    }
  };

  const decode = () => {
    try {
      if (isBatch) {
        const lines = input.split('\n');
        const decoded = lines.map(line => line ? safeAtob(line) : '').join('\n');
        setOutput(decoded);
      } else {
        setOutput(safeAtob(input));
      }
    } catch (e) {
      setOutput('Error: Invalid Base64 string');
    }
  };

  const copyToClipboard = async () => {
    try {
      const { writeToClipboard } = await import('./clipboard');
      const ok = await writeToClipboard(output);
      if (ok) showToast('Copied to clipboard!', 'success');
      else showToast('Copy failed', 'error');
    } catch (e) {
      showToast('Copy failed', 'error');
    }
  };

  return (
    <ToolShell
      title="Base64 Converter"
      description="Encode and decode text to Base64 format locally."
      path="/tools/base64"
      icon={Hash}
      iconColor="bg-pink-500"
    >

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Input</span>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsBatch(!isBatch)} 
                aria-pressed={isBatch}
                className={`flex items-center gap-1 text-xs font-bold transition-colors ${isBatch ? 'text-pink-500' : 'text-slate-500'}`}
                title="Process each line separately"
              >
                <ListChecks size={16} /> BATCH MODE
              </button>
              <button onClick={() => setInput('')} aria-label="Clear Base64 input" className="text-slate-500 hover:text-red-400 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-pink-100 focus:ring-2 focus:ring-pink-500 outline-none resize-none transition-all"
            placeholder="Type or paste text here..."
          />
          <div className="flex gap-3">
            <button onClick={encode} className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-pink-600/20">Encode</button>
            <button onClick={decode} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all">Decode</button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2 text-sm font-medium text-slate-400 uppercase">Output</div>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm overflow-auto relative">
            {output ? (
              <div className="relative">
                <pre className="text-pink-300 whitespace-pre-wrap break-all">{output}</pre>
                <div className="absolute top-4 right-4">
                  <CopyButton value={output} label="Copy Base64 output" />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">Output appears here after encoding or decoding.</div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
