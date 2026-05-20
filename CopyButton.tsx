import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useToast } from './ToastContext';
import { writeToClipboard } from './clipboard';

interface CopyButtonProps {
  value: string;
  label?: string;
  onCopy?: () => void;
}

export const CopyButton = ({ value, label = 'Copy', onCopy }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      const ok = await writeToClipboard(value);
      if (ok) {
        setCopied(true);
        onCopy?.();
        showToast(`${label} copied to clipboard!`, 'success');
        window.setTimeout(() => setCopied(false), 1800);
      } else {
        throw new Error('clipboard fallback failed');
      }
    } catch (error) {
      showToast('Copy failed. Please copy manually.', 'error');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800 transition shadow-sm"
      aria-label={label}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  );
};
