import { Link } from 'react-router-dom';
import { relatedTools, toolByPath } from './toolsData';
import { Sparkles } from 'lucide-react';

interface RelatedToolsProps {
  currentPath: string;
}

export const RelatedTools = ({ currentPath }: RelatedToolsProps) => {
  const tools = relatedTools(currentPath, 3);
  const currentTool = toolByPath(currentPath);

  if (!currentTool || tools.length === 0) return null;

  return (
    <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-950/70 p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Related tools</p>
          <h2 className="text-2xl font-bold">More {currentTool.category} utilities</h2>
        </div>
        <Sparkles size={28} className="text-emerald-400" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="block rounded-3xl border border-slate-800 p-5 hover:border-blue-500/50 hover:bg-slate-900 transition"
          >
            <p className="text-sm text-slate-400 mb-2">{tool.category}</p>
            <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">{tool.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
