import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, subtitle, linkText = 'View all', linkTo = '/shop' }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
      <div>
        {subtitle && (
          <p className="text-[11px] tracking-[0.2em] font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">
            {subtitle}
          </p>
        )}
        <div className="flex items-center gap-3">
          <span className="inline-flex h-7 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
      </div>
      <Link
        to={linkTo}
        className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors whitespace-nowrap"
      >
        {linkText}
        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default SectionHeader;
