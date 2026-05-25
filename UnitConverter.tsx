import { useState } from 'react';
import { ToolShell } from './ToolShell';
import { CopyButton } from './CopyButton';
import { useKeyboardShortcut } from './useKeyboardShortcut';
import { Ruler, RefreshCw, Palette } from 'lucide-react';
import { useToast } from './ToastContext';

export const UnitConverter = () => {
  const [px, setPx] = useState('16');
  const [rem, setRem] = useState('1');
  const [baseSize, setBaseSize] = useState('16');
  const [activeUnit, setActiveUnit] = useState<'px' | 'rem'>('px');
  const [hex, setHex] = useState('#3b82f6');
  const [rgb, setRgb] = useState('rgb(59, 130, 246)');
  const { showToast } = useToast();

  // PX to REM logic
  const handlePxChange = (val: string) => {
    setPx(val);
    setActiveUnit('px');
    const pxValue = Number(val);
    const baseValue = Number(baseSize);
    if (Number.isFinite(pxValue) && baseValue > 0) {
      setRem((pxValue / baseValue).toString());
    }
  };

  const handleRemChange = (val: string) => {
    setRem(val);
    setActiveUnit('rem');
    const remValue = Number(val);
    const baseValue = Number(baseSize);
    if (Number.isFinite(remValue) && baseValue > 0) {
      setPx((remValue * baseValue).toString());
    }
  };

  const handleBaseSizeChange = (val: string) => {
    setBaseSize(val);
    const nextBase = Number(val);
    if (!Number.isFinite(nextBase) || nextBase <= 0) return;

    if (activeUnit === 'px') {
      const pxValue = Number(px);
      if (Number.isFinite(pxValue)) setRem((pxValue / nextBase).toString());
      return;
    }

    const remValue = Number(rem);
    if (Number.isFinite(remValue)) setPx((remValue * nextBase).toString());
  };

  // Color Conversion logic
  const hexToRgb = (hexStr: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexStr);
    return result ? 
      `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    const converted = hexToRgb(val);
    if (converted) setRgb(converted);
  };

  useKeyboardShortcut(
    { key: 'c', ctrl: true, shift: true },
    async () => {
      if (rgb) {
        try {
          const { writeToClipboard } = await import('./clipboard');
          const ok = await writeToClipboard(rgb);
          if (ok) showToast('RGB copied!', 'success');
          else showToast('Copy failed', 'error');
        } catch (e) {
          showToast('Copy failed', 'error');
        }
      }
    },
    Boolean(rgb)
  );

  return (
    <ToolShell
      title="Unit Converter"
      description="Convert CSS units (PX to REM) and Colors (Hex to RGB) instantly."
      path="/tools/unit-converter"
      icon={Ruler}
      iconColor="bg-yellow-500"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
          <Ruler size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Unit Converter</h2>
          <p className="text-slate-400">CSS Units & Color conversions for developers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CSS Units Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          <h3 className="text-xl font-bold flex items-center gap-2 text-yellow-500">
            <RefreshCw size={20} /> CSS Units (Base: {baseSize}px)
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Pixels (px)</label>
              <input 
                type="number" 
                value={px} 
                onChange={(e) => handlePxChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xl font-mono text-white outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">REM</label>
              <input 
                type="number" 
                value={rem} 
                onChange={(e) => handleRemChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xl font-mono text-white outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800">
             <label className="text-xs text-slate-500">Base Font Size (default 16px)</label>
             <input type="range" min="8" max="32" value={baseSize} onChange={(e) => handleBaseSizeChange(e.target.value)} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 mt-2" />
          </div>
        </div>

        {/* Color Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
          <h3 className="text-xl font-bold flex items-center gap-2 text-blue-500">
            <Palette size={20} /> Color Converter
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Hex Color</label>
                <input 
                  type="text" 
                  value={hex} 
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-16 h-16 rounded-xl border border-slate-700 shadow-inner" style={{ backgroundColor: hex }}></div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">RGB Result</label>
              <div className="flex items-center justify-between w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-blue-400">
                <span>{rgb}</span>
                <CopyButton value={rgb} label="Copy RGB" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
};
