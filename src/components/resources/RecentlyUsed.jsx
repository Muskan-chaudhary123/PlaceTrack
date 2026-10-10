import React from 'react';
import { Clock, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * Sidebar component displaying the 4 most recently used templates or notes.
 */
export const RecentlyUsed = ({ resources = [], onOpen }) => {
  // Filter items with valid lastUsedAt date, sort by date descending
  const recentList = [...resources]
    .filter((r) => r.lastUsedAt && r.lastUsedAt.trim() !== '')
    .sort((a, b) => new Date(b.lastUsedAt) - new Date(a.lastUsedAt))
    .slice(0, 4);

  const typeLabels = {
    Note: 'Note',
    'Email Template': 'Email',
    'Message Template': 'Msg',
    Document: 'Doc',
    Link: 'Link',
    Checklist: 'Task'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
      <div className="border-b border-slate-100 pb-2.5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>Recently Used</span>
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Quick access to frequent templates</p>
      </div>

      <div className="space-y-2">
        {recentList.length === 0 ? (
          <div className="text-center py-6 text-slate-450 italic">
            No templates opened recently.
          </div>
        ) : (
          recentList.map((r) => (
            <div
              key={r.id}
              onClick={() => onOpen(r.id)}
              className="group flex items-center justify-between rounded border border-slate-100 bg-slate-50/50 p-2.5 hover:border-slate-200 hover:bg-slate-100/30 transition-all cursor-pointer"
            >
              <div className="min-w-0 flex-1 pr-2">
                <h4 className="font-bold text-slate-800 truncate leading-snug group-hover:text-primary transition-colors">
                  {r.title}
                </h4>
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  {r.category} · {typeLabels[r.type] || r.type}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-primary transition-all shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default RecentlyUsed;
