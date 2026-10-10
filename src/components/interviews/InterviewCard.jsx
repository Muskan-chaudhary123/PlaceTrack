import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ExternalLink, HelpCircle, FileX, ArrowRight } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';

/**
 * Clean card display for both Upcoming Scheduled rounds and Completed Interview Histories.
 */
export const InterviewCard = ({ interview, isHistory = false }) => {
  const statusBadgeClass = {
    Scheduled: 'bg-blue-50 text-primary border-blue-200',
    Rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
    Cancelled: 'bg-slate-50 text-slate-500 border-slate-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-orange-50 text-orange-700 border-orange-200'
  }[interview.status] || 'bg-slate-50 text-slate-700 border-slate-200';

  const resultBadgeClass = {
    Pending: 'bg-slate-50 text-slate-500 border-slate-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200'
  }[interview.result] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-350 hover:shadow-xs transition-all duration-150 select-none">
      <div>
        {/* Company Header */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {interview.companyName}
          </h4>
          <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider shrink-0 ${
            isHistory ? resultBadgeClass : statusBadgeClass
          }`}>
            {isHistory ? `Result: ${interview.result}` : interview.status}
          </span>
        </div>

        {/* Role & Round */}
        <h5 className="text-xs font-bold text-slate-700 line-clamp-1 leading-snug">
          {interview.role}
        </h5>
        
        <span className="inline-block mt-2 rounded bg-slate-50 px-2 py-0.5 text-[9px] font-semibold text-slate-500 border border-slate-100 uppercase tracking-wide">
          {interview.round}
        </span>
      </div>

      {/* Details / History Highlights */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-[10px] text-slate-400">
        {!isHistory ? (
          <>
            {/* Scheduling Details */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{formatDate(interview.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{interview.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {interview.type === 'Online' || interview.type === 'Video Call'
                  ? 'Virtual / Online'
                  : interview.location || 'Offline Location'}
              </span>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center text-[9px] text-slate-500 font-semibold pt-1">
            <div className="rounded bg-slate-50 border border-slate-100 p-1.5">
              <div className="text-[10px] font-bold text-primary">{interview.questions?.length || 0}</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Questions</div>
            </div>
            <div className="rounded bg-slate-50 border border-slate-100 p-1.5">
              <div className="text-[10px] font-bold text-red-500">{interview.mistakes?.length || 0}</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Mistakes</div>
            </div>
            <div className="rounded bg-slate-50 border border-slate-100 p-1.5">
              <div className="text-[10px] font-bold text-emerald-600">{interview.learnings?.length || 0}</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Learnings</div>
            </div>
          </div>
        )}
      </div>

      {/* Button link to details */}
      <div className="mt-5 flex justify-end">
        <Link to={`/interviews/${interview.id}`} className="w-full">
          <button
            type="button"
            className="flex w-full items-center justify-center space-x-1 rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:text-primary transition-all duration-150 cursor-pointer"
          >
            <span>View Interview</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </Link>
      </div>
    </div>
  );
};
export default InterviewCard;
