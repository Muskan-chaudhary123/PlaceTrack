import React from 'react';

/**
 * Minimal Stat Card component displaying a metric, label, icon, and contextual indicator.
 * Follows a clean SaaS design language with comfortable typography and subtle borders.
 */
export const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  trendType = 'neutral',
  iconBg = 'bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-400'
}) => {
  const trendColorClass = {
    positive: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40',
    negative: 'text-red-600 bg-red-50 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/40',
    neutral: 'text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
  }[trendType] || 'text-slate-500 bg-slate-50 border-slate-100';

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-5.5 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 transition-all hover:border-slate-300 dark:hover:border-slate-600">
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-[15px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
          {label}
        </span>
        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} transition-colors shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-2.5">
        <span className="text-[26px] sm:text-[30px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
          {value}
        </span>
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center justify-between text-sm">
          {subtext && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {subtext}
            </span>
          )}
          {trend && (
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold border ${trendColorClass}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
