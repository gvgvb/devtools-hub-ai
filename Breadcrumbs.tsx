import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-400">
    <ol className="flex flex-wrap items-center gap-1">
      {items.map((item, index) => (
        <li key={item.to} className="flex items-center gap-1">
          <Link to={item.to} className="hover:text-slate-200 transition underline-offset-4 hover:underline">
            {item.label}
          </Link>
          {index < items.length - 1 && <ChevronRight size={14} className="text-slate-500" />}
        </li>
      ))}
    </ol>
  </nav>
);
