import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Compact Recent Applications table component.
 * Displays Company, Role, Applied Date, and Status with comfortable SaaS typography.
 */
export const RecentApplications = ({ applications = [], onAddClick }) => {
  const apps = applications || [];

  const recentApps = [...apps]
    .sort((a, b) => new Date(b.appliedDate || 0) - new Date(a.appliedDate || 0))
    .slice(0, 5);

  const formatSimpleDate = (dateStr) => {
    if (!dateStr) return '—';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  const getStatusBadge = (status) => {
    const s = status || 'Applied';
    const config = {
      Applied: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      OA: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
      Screening: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
      Interview: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
      Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
      Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
      Rejected: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50',
      Withdrawn: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
    }[s] || 'bg-slate-100 text-slate-700 border-slate-200';

    return (
      <span className={`inline-block rounded-md border px-2.5 py-1 text-xs sm:text-sm font-semibold tracking-wide ${config}`}>
        {s}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 flex flex-col justify-between h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg sm:text-[20px] font-semibold text-slate-900 dark:text-white leading-tight">
            Recent Applications
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Latest job and internship submissions
          </p>
        </div>
        <Link
          to="/applications"
          className="text-sm font-semibold text-primary hover:text-primary-dark dark:text-blue-400 flex items-center space-x-1.5 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center">
        {recentApps.length === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100 dark:border-slate-700">
              <Briefcase className="h-5.5 w-5.5" />
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No applications yet
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
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 font-semibold text-slate-500 dark:text-slate-400 tracking-wide text-xs sm:text-sm">
                  <th className="px-5 sm:px-6 py-3.5">Company</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Applied Date</th>
                  <th className="px-5 sm:px-6 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 dark:divide-slate-700/50 font-normal text-slate-700 dark:text-slate-300">
                {recentApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-750/40 transition-colors"
                  >
                    <td className="px-5 sm:px-6 py-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-bold text-sm uppercase shrink-0">
                          {app.companyName ? app.companyName.charAt(0) : 'C'}
                        </div>
                        <span className="truncate max-w-[140px] sm:max-w-none text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {app.companyName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
                      {app.role}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatSimpleDate(app.appliedDate)}
                    </td>
                    <td className="px-5 sm:px-6 py-3.5 text-right whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentApplications;
