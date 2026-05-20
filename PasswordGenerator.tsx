import { useState, useCallback, useEffect } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Key, RefreshCw } from 'lucide-react';
import { useToast } from './ToastContext';

export const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const { showToast } = useToast();

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let availableChars = '';
    if (options.uppercase) availableChars += charset.uppercase;
    if (options.lowercase) availableChars += charset.lowercase;
    if (options.numbers) availableChars += charset.numbers;
    if (options.symbols) availableChars += charset.symbols;

    if (availableChars === '') {
      setPassword('');
      return;
    }

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += availableChars.charAt(randomValues[i] % availableChars.length);
    }
    setPassword(generated);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (password) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(password);
          if (ok) showToast('Password copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(password)
  );

  const copyToClipboard = () => {
    if (!password) return;
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(password);
        if (ok) showToast('Password copied to clipboard!', 'success');
        else showToast('Copy failed', 'error');
      } catch (e) {
        showToast('Copy failed', 'error');
      }
    })();
  };

  return (
    <ToolShell
      title="Password Generator"
      description="Generate strong, secure, and customizable passwords locally."
      path="/tools/password-gen"
      icon={Key}
      iconColor="bg-indigo-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
          <Key size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Password Generator</h2>
          <p className="text-slate-400">Create secure passwords to protect your accounts.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl">
        <div className="relative group">
          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-2xl text-center text-indigo-400 break-all min-h-[80px] flex items-center justify-center">
            {password}
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={generatePassword} aria-label="Generate new password" className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-all">
              <RefreshCw size={20} />
            </button>
            <CopyButton value={password} label="Copy generated password" onCopy={copyToClipboard} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
              <span>Password Length</span>
              <span className="text-indigo-400 text-lg">{length}</span>
            </div>
            <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} aria-label="Password length" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(options).map(([key, val]) => (
              <button key={key} onClick={() => setOptions(prev => ({ ...prev, [key]: !val }))} aria-pressed={val} className={`p-4 rounded-2xl border transition-all text-sm font-bold uppercase tracking-wider ${val ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
