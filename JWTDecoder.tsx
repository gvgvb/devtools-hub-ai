import { useState, useMemo } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { ShieldCheck, AlertCircle, Clock, Trash2 } from 'lucide-react';
import { useToast } from './ToastContext';

export const JWTDecoder = () => {
  const [token, setToken] = useState('');
  const { showToast } = useToast();
  
  const decodeToken = (part: number) => {
    try {
      const base64Url = token.split('.')[part];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(base64Url.length / 4) * 4, '=');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.stringify(JSON.parse(jsonPayload), null, 2);
    } catch (e) {
      return null;
    }
  };

  const header = useMemo(() => decodeToken(0), [token]);
  const payload = useMemo(() => decodeToken(1), [token]);

  const expirationDate = useMemo(() => {
    if (!payload) return null;
    try {
      const p = JSON.parse(payload);
      if (p.exp) {
        return new Date(p.exp * 1000).toLocaleString();
      }
    } catch (e) { /* ignore */ }
    return null;
  }, [payload]);

  const copyData = (data: string | null) => {
    if (!data) return;
    (async () => {
      try {
        const { writeToClipboard } = await import('./clipboard');
        const ok = await writeToClipboard(data);
        if (ok) showToast('Data copied to clipboard!', 'success');
        else showToast('Copy failed', 'error');
      } catch (e) {
        showToast('Copy failed', 'error');
      }
    })();
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (payload) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(payload);
          if (ok) showToast('JWT payload copied to clipboard', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(payload)
  );

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode JSON Web Tokens (JWT) locally and safely in your browser."
      path="/tools/jwt"
      icon={ShieldCheck}
      iconColor="bg-purple-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">JWT Decoder</h2>
          <p className="text-slate-400">Inspect and debug your JWT tokens safely (Local only).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Encoded Token</label>
            <button onClick={() => setToken('')} aria-label="Clear JWT token" className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-purple-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none transition-all"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          />
          
          {expirationDate && (
            <div className="flex items-center gap-2 text-sm bg-purple-500/10 text-purple-400 p-3 rounded-lg border border-purple-500/20">
              <Clock size={16} />
              <span className="font-semibold">Expiration Date:</span>
              <span>{expirationDate}</span>
              {new Date(expirationDate) < new Date() && (
                <span className="ml-auto bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Expired</span>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-200">Header</h3>
              {header && (
                <CopyButton value={header} label="Copy JWT header" onCopy={() => copyData(header)} />
              )}
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm h-64 overflow-auto">
              {header ? (
                <pre className="text-red-400">{header}</pre>
              ) : (
                <div className="flex items-center gap-2 text-slate-600 h-full justify-center">
                  <AlertCircle size={16} />
                  <span>No valid header detected</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-200">Payload</h3>
              {payload && (
                <CopyButton value={payload} label="Copy JWT payload" onCopy={() => copyData(payload)} />
              )}
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-sm h-64 overflow-auto">
              {payload ? (
                <pre className="text-blue-400">{payload}</pre>
              ) : (
                <div className="flex items-center gap-2 text-slate-600 h-full justify-center">
                  <AlertCircle size={16} />
                  <span>No valid payload detected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
