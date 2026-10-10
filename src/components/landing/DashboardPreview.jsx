import React from 'react';
import { Calendar, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * Clean CSS-based dashboard preview component to display on the hero section.
 */
export const DashboardPreview = () => {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-md sm:p-4">
      {/* Mock Header */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
          <div className="h-3 w-3 rounded-full bg-slate-300"></div>
        </div>
        <div className="h-4 w-32 rounded bg-slate-200"></div>
      </div>

      {/* Mock Stats Grid */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded border border-slate-200 bg-white p-2.5">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Apps</div>
          <div className="text-sm font-bold text-slate-800">42</div>
        </div>
        <div className="rounded border border-slate-200 bg-white p-2.5">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Interviews</div>
          <div className="text-sm font-bold text-primary">8</div>
        </div>
        <div className="rounded border border-slate-200 bg-white p-2.5">
          <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Offers</div>
          <div className="text-sm font-bold text-emerald-600">2</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Mock Application List */}
        <div className="rounded border border-slate-200 bg-white p-3">
          <h4 className="text-[11px] font-semibold text-slate-600 mb-2 uppercase tracking-wide">
            Recent Applications
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">Google</span>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Interview
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
              <span className="font-medium text-slate-700">Stripe</span>
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                Online Assessment
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
              <span className="font-medium text-slate-700">Microsoft</span>
              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                Offer
              </span>
            </div>
          </div>
        </div>

        {/* Mock Upcoming Interview */}
        <div className="rounded border border-slate-200 bg-white p-3 flex flex-col justify-between">
          <div>
            <h4 className="text-[11px] font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Upcoming Interview
            </h4>
            <div className="flex items-start space-x-2 text-xs">
              <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-800">Stripe</div>
                <div className="text-[10px] text-slate-500">Software Engineer Intern</div>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-2 text-[10px] font-medium text-slate-500">
            Aug 15 · 3:00 PM
          </div>
        </div>
      </div>
    </div>
  );
};
