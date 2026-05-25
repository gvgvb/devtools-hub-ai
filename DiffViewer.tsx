import { useMemo, useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { useToast } from './ToastContext';
import { Columns, ArrowRightLeft, Trash2 } from 'lucide-react';

type DiffLine = {
  type: 'added' | 'removed' | 'unchanged';
  line: string;
  originalLine?: number;
  modifiedLine?: number;
};

const buildLineDiff = (originalText: string, modifiedText: string): DiffLine[] => {
  const originalLines = originalText.split('\n');
  const modifiedLines = modifiedText.split('\n');
  const dp = Array.from({ length: originalLines.length + 1 }, () =>
    Array(modifiedLines.length + 1).fill(0) as number[]
  );

  for (let i = originalLines.length - 1; i >= 0; i -= 1) {
    for (let j = modifiedLines.length - 1; j >= 0; j -= 1) {
      dp[i][j] = originalLines[i] === modifiedLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const diff: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < originalLines.length && j < modifiedLines.length) {
    if (originalLines[i] === modifiedLines[j]) {
      diff.push({ type: 'unchanged', line: originalLines[i], originalLine: i + 1, modifiedLine: j + 1 });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      diff.push({ type: 'removed', line: originalLines[i], originalLine: i + 1 });
      i += 1;
    } else {
      diff.push({ type: 'added', line: modifiedLines[j], modifiedLine: j + 1 });
      j += 1;
    }
  }

  while (i < originalLines.length) {
    diff.push({ type: 'removed', line: originalLines[i], originalLine: i + 1 });
    i += 1;
  }

  while (j < modifiedLines.length) {
    diff.push({ type: 'added', line: modifiedLines[j], modifiedLine: j + 1 });
    j += 1;
  }

  return diff;
};

export const DiffViewer = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const { showToast } = useToast();
  const diffLines = useMemo(() => buildLineDiff(original, modified), [original, modified]);

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
            <CopyButton value={modified} label="Copy modified text" />
          )}
        </div>
        <div className="space-y-1 font-mono text-sm overflow-auto max-h-96">
          {original === modified ? (
            <div className="text-slate-500 italic py-10 text-center">No differences detected or fields are empty.</div>
          ) : (
            diffLines.map((item, i) => {
              const tone = item.type === 'added'
                ? 'bg-emerald-500/10 text-emerald-300'
                : item.type === 'removed'
                ? 'bg-red-500/10 text-red-300'
                : 'text-slate-500 opacity-70';
              return (
                <div key={`${item.type}-${i}`} className={`grid grid-cols-[3rem_3rem_2rem_1fr] gap-3 rounded p-1 ${tone}`}>
                  <span className="text-right select-none opacity-40">{item.originalLine ?? ''}</span>
                  <span className="text-right select-none opacity-40">{item.modifiedLine ?? ''}</span>
                  <span className="select-none font-bold">{item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}</span>
                  <span className="whitespace-pre-wrap break-words">{item.line || ' '}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ToolShell>
  );
};
