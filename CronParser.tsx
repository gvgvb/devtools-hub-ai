import { useState, useEffect } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { useToast } from './ToastContext';
import { Clock, Info, AlertCircle } from 'lucide-react';

const fieldLabels = {
  minute: 'minute',
  hour: 'hour',
  day: 'day of month',
  month: 'month',
  weekday: 'day of week',
} as const;

const ranges = {
  minute: [0, 59],
  hour: [0, 23],
  day: [1, 31],
  month: [1, 12],
  weekday: [0, 7],
} as const;

type CronField = keyof typeof ranges;

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const validateNumber = (value: string, field: CronField) => {
  const number = Number(value);
  const [min, max] = ranges[field];
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${fieldLabels[field]} must be between ${min} and ${max}.`);
  }
  return number;
};

const describeField = (value: string, field: CronField) => {
  const [min, max] = ranges[field];
  const label = fieldLabels[field];

  if (value === '*') return `every ${label}`;

  const step = value.match(/^\*\/(\d+)$/);
  if (step) {
    const amount = validateNumber(step[1], field);
    if (amount <= 0) throw new Error(`${label} step must be greater than 0.`);
    return `every ${amount} ${label}${amount === 1 ? '' : 's'}`;
  }

  const range = value.match(/^(\d+)-(\d+)$/);
  if (range) {
    const start = validateNumber(range[1], field);
    const end = validateNumber(range[2], field);
    if (start > end) throw new Error(`${label} range must start before it ends.`);
    return `${label}s ${start} through ${end}`;
  }

  if (value.includes(',')) {
    const values = value.split(',').map((part) => validateNumber(part, field));
    return `${label}s ${values.join(', ')}`;
  }

  const number = validateNumber(value, field);
  if (field === 'weekday') return weekdays[number];
  return `${label} ${number}`;
};

const describeCron = (exp: string) => {
  const parts = exp.trim().split(/\s+/);
  if (parts.length !== 5) throw new Error('Cron must have 5 parts: minute hour day month weekday.');

  const [minute, hour, day, month, weekday] = parts;
  const minuteDesc = describeField(minute, 'minute');
  const hourDesc = describeField(hour, 'hour');
  const dayDesc = describeField(day, 'day');
  const monthDesc = describeField(month, 'month');
  const weekdayDesc = describeField(weekday, 'weekday');

  if (minute === '0' && hour === '0' && day === '*' && month === '*' && weekday === '*') {
    return 'Runs every day at midnight.';
  }
  if (minute === '0' && hour === '*' && day === '*' && month === '*' && weekday === '*') {
    return 'Runs at the start of every hour.';
  }

  return `Runs on ${minuteDesc}, ${hourDesc}, ${dayDesc}, ${monthDesc}, and ${weekdayDesc}.`;
};

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
      setDescription(describeCron(exp));
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
            aria-label="Cron expression"
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
