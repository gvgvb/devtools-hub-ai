import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { useToast } from './ToastContext';
import { Columns, ArrowRightLeft, Trash2 } from 'lucide-react';

export const DiffViewer = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const { showToast } = useToast();

  const copyOutput = () => {
    if (!modified) return;
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(modified);
        if (ok) showToast('Modified text copied to clipboard', 'success');
        else showToast('Copy failed', 'error');
      } catch (e) {
        showToast('Copy failed', 'error');
      }
    })();
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    copyOutput,
    Boolean(modified)
  );

  return (
    <ToolShell
      title="Diff Viewer"
      description="Compare two text snippets or code blocks to find differences."
      path="/tools/diff"
      icon={Columns}
      iconColor="bg-indigo-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
            <span>Original Text</span>
            <button onClick={() => setOriginal('')} aria-label="Clear original text" className="hover:text-red-400"><Trash2 size={16}/></button>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Paste original text here..."
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
            <span>Modified Text</span>
            <button onClick={() => setModified('')} aria-label="Clear modified text" className="hover:text-red-400"><Trash2 size={16}/></button>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="Paste modified text here..."
          />
        </div>
      </div>

      <div className="mt-8 bg-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2"><ArrowRightLeft size={20} className="text-indigo-400" /> Comparison Result</h3>
          {modified && (
            <CopyButton value={modified} label="Copy modified diff output" onCopy={copyOutput} />
          )}
        </div>
        <div className="space-y-1 font-mono text-sm overflow-auto max-h-96">
          {original === modified ? (
            <div className="text-slate-500 italic py-10 text-center">No differences detected or fields are empty.</div>
          ) : (
            modified.split('\n').map((line, i) => {
              const isDifferent = !original.split('\n').includes(line);
              return (
                <div key={i} className={`flex gap-4 p-1 rounded ${isDifferent ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-500 opacity-50'}`}>
                  <span className="w-8 shrink-0 text-right select-none opacity-30">{i + 1}</span>
                  <span>{line || ' '}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ToolShell>
  );
};
