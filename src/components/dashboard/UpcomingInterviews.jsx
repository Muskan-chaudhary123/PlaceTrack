import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Modern Upcoming Interviews component.
 * Displays scheduled interviews with comfortable typography and clear visual hierarchy.
 */
export const UpcomingInterviews = ({ interviews = [] }) => {
  const ints = interviews || [];

  // Filter only upcoming/pending/rescheduled rounds
  const upcomingInts = ints
    .filter((i) => i.status === 'Scheduled' || i.status === 'Rescheduled' || i.status === 'Pending')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const formatSimpleDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  const formatSimpleTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m} ${ampm}`;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 flex flex-col justify-between h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg sm:text-[20px] font-semibold text-slate-900 dark:text-white leading-tight">
            Upcoming Interviews
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Your next scheduled rounds
          </p>
        </div>
        <Link
          to="/interviews"
          className="text-sm font-semibold text-primary hover:text-primary-dark dark:text-blue-400 flex items-center space-x-1.5 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="py-3 flex-1 flex flex-col justify-center">
        {upcomingInts.length === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100 dark:border-slate-700">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No upcoming interviews
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              You don't have any interviews scheduled at the moment.
            </p>
            <div className="mt-4.5">
              <Link to="/interviews">
                <Button
                  variant="outline"
                  size="md"
                  className="inline-flex items-center space-x-2 text-sm font-medium px-4 py-2"
                >
                  <span>Schedule an interview</span>
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {upcomingInts.map((interview) => (
              <Link
                key={interview.id}
                to={`/interviews/${interview.id}`}
                className="block group rounded-lg border border-slate-150/80 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs dark:bg-slate-900/30 dark:border-slate-700/60 dark:hover:bg-slate-800/80 dark:hover:border-slate-600"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">
                      {interview.companyName}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium truncate mt-0.5">
                      {interview.role}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center">
                    {interview.round && (
                      <span className="rounded-md px-2.5 py-1 text-xs sm:text-sm font-semibold bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40">
                        {interview.round}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{formatSimpleDate(interview.date)}</span>
                  </span>
                  {interview.time && (
                    <span className="flex items-center space-x-1.5">
                      <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <span>{formatSimpleTime(interview.time)}</span>
                    </span>
                  )}
                  {interview.type && (
                    <span className="flex items-center space-x-1.5 text-slate-500">
                      <span>•</span>
                      <span>{interview.type}</span>
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingInterviews;
