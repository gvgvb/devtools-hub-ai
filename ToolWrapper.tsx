import type { ComponentType, ReactNode } from 'react';

interface ToolWrapperProps {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  children: ReactNode;
}

export const ToolWrapper = ({ title, description, icon: Icon, iconColor, children }: ToolWrapperProps) => (
  <div className="max-w-6xl mx-auto">
    <div className="flex items-center gap-3 mb-8">
      <div className={`p-3 rounded-xl ${iconColor} bg-opacity-10`}>
        <Icon size={32} className={iconColor.replace('bg-', 'text-')} />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-slate-400">{description}</p>
      </div>
    </div>
    {children}
  </div>
);
