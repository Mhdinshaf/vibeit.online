import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, subtitle, linkText = 'View all', linkTo = '/shop' }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
      <div>
        {subtitle && (
          <p className="text-xs tracking-[0.12em] font-bold text-orange-500 dark:text-orange-400 uppercase mb-2">
            {subtitle}
          </p>
        )}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
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
