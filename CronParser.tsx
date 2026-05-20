import { useState, useEffect } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { useToast } from './ToastContext';
import { Clock, Info, AlertCircle } from 'lucide-react';

export const CronParser = () => {
  const [cron, setCron] = useState('*/5 * * * *');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const copyDescription = () => {
    if (!description) return;
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(description);
        if (ok) showToast('Cron description copied to clipboard', 'success');
        else showToast('Copy failed', 'error');
      } catch (e) {
        showToast('Copy failed', 'error');
      }
    })();
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    copyDescription,
    Boolean(description)
  );

  const parseCron = (exp: string) => {
    try {
      const parts = exp.split(' ');
      if (parts.length !== 5) throw new Error("Cron must have 5 parts (m h d M dw)");
      
      // Simple human-readable logic for common patterns
      let desc = "Runs ";
      if (exp === "0 0 * * *") desc += "every day at midnight.";
      else if (exp === "0 * * * *") desc += "at the start of every hour.";
      else if (exp === "*/5 * * * *") desc += "every 5 minutes.";
      else if (exp === "0 0 * * 0") desc += "at midnight every Sunday.";
      else desc = "Standard cron expression detected. Logic: [Minute] [Hour] [Day] [Month] [Day of Week].";

      setDescription(desc);
      setError('');
    } catch (e: any) {
      setError(e.message);
      setDescription('');
    }
  };

  useEffect(() => {
    parseCron(cron);
  }, [cron]);

  return (
    <ToolShell
      title="Cron Expression Parser"
      description="Parse and explain Cron expressions in plain English."
      path="/tools/cron"
      icon={Clock}
      iconColor="bg-emerald-500"
    >
      <div className="max-w-4xl mx-auto space-y-8">

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Cron Expression</label>
          <input 
            type="text" 
            value={cron} 
            onChange={(e) => setCron(e.target.value)}
            className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-slate-800'} rounded-2xl p-6 font-mono text-2xl text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
            placeholder="* * * * *"
          />
        </div>

        {error ? (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 animate-fade-in">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <div className="flex items-start gap-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl animate-fade-in">
            <Info size={24} className="text-emerald-500 shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-lg text-slate-200 font-medium leading-relaxed">{description}</p>
              <div className="flex flex-wrap gap-3 items-center mt-2">
                <CopyButton
                  value={description}
                  label="Copy cron description"
                  onCopy={copyDescription}
                />
                <span className="text-xs text-slate-500 font-mono italic">Next execution: Calculated by server/OS scheduler</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 pt-4 text-[10px] font-bold text-slate-600 uppercase text-center">
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">Min</div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">Hour</div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">Day</div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">Month</div>
          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">Weekday</div>
        </div>
      </div>
    </div>
    </ToolShell>
  );
};