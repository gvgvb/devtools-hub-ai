import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Link as LinkIcon, Trash2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const URLTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { showToast } = useToast();

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (output) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(output);
          if (ok) showToast('URL output copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(output)
  );

  const handleEncode = () => {
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      showToast("Error encoding URL", "error");
    }
  };

  const handleDecode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      showToast("Invalid URL encoding", "error");
    }
  };

  return (
    <ToolShell
      title="URL Encoder & Decoder"
      description="Encode or decode URLs and parameters safely."
      path="/tools/url"
      icon={LinkIcon}
      iconColor="bg-blue-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
          <LinkIcon size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">URL Encoder/Decoder</h2>
          <p className="text-slate-400">Process URL parameters and special characters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[450px]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Input</span>
            <button onClick={() => setInput('')} aria-label="Clear URL input" className="text-slate-500 hover:text-red-400"><Trash2 size={18}/></button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-blue-100 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter URL or text here..."
          />
          <div className="flex gap-3">
            <button onClick={handleEncode} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">Encode</button>
            <button onClick={handleDecode} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all">Decode</button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Output</span>
            {output && (
              <CopyButton value={output} label="Copy URL output" onCopy={() => showToast('Copied!')} />
            )}
          </div>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm overflow-auto text-blue-300 break-all whitespace-pre-wrap">
            {output || <div className="text-slate-600 italic">Encoded or decoded output will appear here.</div>}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
