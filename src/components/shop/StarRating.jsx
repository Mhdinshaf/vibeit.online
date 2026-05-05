import { Star } from 'lucide-react';

const StarRating = ({ rating = 4.5, count = 128, compact = false }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => {
          const fillPercentage = Math.min(Math.max(rating - i, 0), 1);
          return (
            <div key={i} className="relative">
              <Star className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              </div>
            </div>
          );
        })}
      </div>
      {!compact && (
        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
