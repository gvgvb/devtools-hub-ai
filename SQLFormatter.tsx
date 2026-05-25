import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Database, Trash2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const SQLFormatter = () => {
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
          if (ok) showToast('SQL copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(output)
  );

  const formatSQL = () => {
    const strings: string[] = [];
    const protectedInput = input.replace(/'([^']|'')*'|"([^"]|"")*"/g, (match) => {
      const token = `__SQL_STRING_${strings.length}__`;
      strings.push(match);
      return token;
    });

    const formatted = protectedInput
      .replace(/\s+/g, ' ')
      .replace(/\s?(SELECT|FROM|WHERE|LEFT JOIN|INNER JOIN|RIGHT JOIN|FULL JOIN|ORDER BY|GROUP BY|HAVING|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE|CREATE|ALTER|DROP|UNION|AND|OR)\s/gi, '\n$1 ')
      .replace(/,/g, ',\n    ')
      .trim()
      .replace(/__SQL_STRING_(\d+)__/g, (_, index) => strings[Number(index)] ?? '');

    setOutput(formatted);
  };

  return (
    <ToolShell
      title="SQL Formatter"
      description="Beautify and format your SQL queries for better readability."
      path="/tools/sql"
      icon={Database}
      iconColor="bg-cyan-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
          <Database size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">SQL Formatter</h2>
          <p className="text-slate-400">Tidy up your SQL queries instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Input SQL</span>
            <button onClick={() => setInput('')} aria-label="Clear SQL input" className="text-slate-500 hover:text-red-400">
              <Trash2 size={18} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-sm text-cyan-100 focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
            placeholder="SELECT * FROM users WHERE active = 1..."
          />
          <button onClick={formatSQL} className="py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-all">
            Format Query
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Formatted Output</span>
            {output && (
              <CopyButton value={output} label="Copy formatted SQL" />
            )}
          </div>
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm overflow-auto">
            {output ? <pre className="text-cyan-300">{output}</pre> : <div className="text-slate-600 italic">Formatted SQL will appear here.</div>}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
