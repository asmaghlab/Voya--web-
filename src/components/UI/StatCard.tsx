import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'primary' | 'accent';
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  variant = 'primary',
  isLoading
}) => {
  const iconBg =
    variant === 'primary'
      ? 'bg-blue-400 text-white'
      : 'bg-emerald-400 text-white';

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{title}</p>

          {isLoading ? (
            <div className="h-7 sm:h-8 w-16 bg-gray-200 animate-pulse rounded" />
          ) : (
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{value}</h3>
          )}
        </div>

        {/* RIGHT ICON */}
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl shadow-md ${iconBg}`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
