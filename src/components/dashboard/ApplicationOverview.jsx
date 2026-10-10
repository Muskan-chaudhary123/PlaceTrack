import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Clean visual breakdown of applications by stage.
 * Uses a segmented status visualization and horizontal proportional distribution bar.
 * Typography tuned for optimal readability and desktop hierarchy.
 */
export const ApplicationOverview = ({ applications = [], onAddClick }) => {
  const apps = applications || [];
  const total = apps.length;

  // Pipeline stage categorization matching requirement:
  // Applied, Screening, Interview, Offer, Rejected
  const counts = {
    Applied: apps.filter(a => a.status === 'Applied').length,
    Screening: apps.filter(a => a.status === 'Screening' || a.status === 'OA' || a.status === 'Assessment').length,
    Interview: apps.filter(a => a.status === 'Interview' || a.status === 'Technical' || a.status === 'HR').length,
    Offer: apps.filter(a => a.status === 'Offer' || a.status === 'Selected' || a.status === 'Accepted').length,
    Rejected: apps.filter(a => a.status === 'Rejected').length
  };

  const stages = [
    {
      key: 'Applied',
      label: 'Applied',
      count: counts.Applied,
      color: 'bg-slate-400 dark:bg-slate-500',
      textColor: 'text-slate-700 dark:text-slate-300',
      dotColor: 'bg-slate-400',
      borderHover: 'hover:border-slate-300 dark:hover:border-slate-600'
    },
    {
      key: 'Screening',
      label: 'Screening',
      count: counts.Screening,
      color: 'bg-purple-500 dark:bg-purple-400',
      textColor: 'text-purple-700 dark:text-purple-300',
      dotColor: 'bg-purple-500',
      borderHover: 'hover:border-purple-200 dark:hover:border-purple-800'
    },
    {
      key: 'Interview',
      label: 'Interview',
      count: counts.Interview,
      color: 'bg-blue-600 dark:bg-blue-500',
      textColor: 'text-blue-700 dark:text-blue-300',
      dotColor: 'bg-blue-600',
      borderHover: 'hover:border-blue-200 dark:hover:border-blue-800'
    },
    {
      key: 'Offer',
      label: 'Offer',
      count: counts.Offer,
      color: 'bg-emerald-500 dark:bg-emerald-400',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      dotColor: 'bg-emerald-500',
      borderHover: 'hover:border-emerald-200 dark:hover:border-emerald-800'
    },
    {
      key: 'Rejected',
      label: 'Rejected',
      count: counts.Rejected,
      color: 'bg-rose-400 dark:bg-rose-500',
      textColor: 'text-rose-700 dark:text-rose-300',
      dotColor: 'bg-rose-400',
      borderHover: 'hover:border-rose-200 dark:hover:border-rose-800'
    }
  ];

  const activeInPipeline = counts.Applied + counts.Screening + counts.Interview;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 flex flex-col justify-between h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg sm:text-[20px] font-semibold text-slate-900 dark:text-white leading-tight">
            Application Pipeline
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Stage distribution of your applications
          </p>
        </div>
        {total > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
            {activeInPipeline} Active
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="py-4.5 flex-1 flex flex-col justify-center">
        {total === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100 dark:border-slate-700">
              <Layers className="h-5.5 w-5.5" />
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No applications in pipeline
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              Start tracking your placement journey by adding your first application.
            </p>
            {onAddClick && (
              <div className="mt-4.5">
                <Button
                  onClick={onAddClick}
                  variant="outline"
                  size="md"
                  className="inline-flex items-center space-x-2 text-sm font-medium px-4 py-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Application</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Segmented horizontal status bar */}
            <div>
              <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-slate-700/60 flex overflow-hidden gap-0.5 p-0.5">
                {stages.map((stage) => {
                  if (stage.count === 0) return null;
                  const pct = ((stage.count / total) * 100).toFixed(1);
                  return (
                    <div
                      key={stage.key}
                      style={{ width: `${pct}%` }}
                      className={`${stage.color} h-full rounded-xs transition-all duration-500`}
                      title={`${stage.label}: ${stage.count} (${pct}%)`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Segmented status breakdown chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stages.map((stage) => {
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                return (
                  <div
                    key={stage.key}
                    className={`rounded-lg border border-slate-150/80 bg-slate-50/70 p-3 dark:bg-slate-900/30 dark:border-slate-700/50 transition-all ${stage.borderHover}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${stage.dotColor}`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {stage.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none">
                        {stage.count}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationOverview;
