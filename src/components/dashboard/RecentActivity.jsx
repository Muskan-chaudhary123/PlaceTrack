import React from 'react';
import {
  PlusCircle,
  FileText,
  UserCheck,
  HelpCircle,
  CheckSquare,
  Clock
} from 'lucide-react';

export const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs dark:bg-slate-800 dark:border-slate-700">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Recent Activity
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Timeline of your placement-related tasks
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs font-medium">
          No recent activity yet.
        </div>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
          {activities.map((activity, idx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {/* Visual connecting line */}
                {idx !== activities.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100"
                    aria-hidden="true"
                  />
                ) : null}
                
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${activity.iconColor}`}>
                      <activity.icon className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-xs text-slate-600">{activity.content}</p>
                    </div>
                    <div className="whitespace-nowrap text-right text-[10px] text-slate-400">
                      <time dateTime={activity.timestamp}>{activity.timestamp}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
};
