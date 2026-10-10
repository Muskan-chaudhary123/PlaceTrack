import React from 'react';

/**
 * Renders a side widget displaying a compact summary of due revision items.
 */
export const RevisionOverview = ({ questions = [] }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const getDueToday = () => {
    return questions.filter(
      (q) => q.nextRevision && q.nextRevision <= todayStr && q.revisionStatus !== 'Revised'
    ).length;
  };

  const getDueThisWeek = () => {
    const todayVal = new Date(todayStr).getTime();
    const sevenDaysLaterVal = todayVal + 7 * 86400000;
    
    return questions.filter((q) => {
      if (!q.nextRevision) return false;
      const qVal = new Date(q.nextRevision).getTime();
      return qVal >= todayVal && qVal <= sevenDaysLaterVal && q.revisionStatus !== 'Revised';
    }).length;
  };

  const getRevisit = () => {
    return questions.filter(
      (q) => q.revisionStatus === 'Revisit' || (q.revisitDate && q.revisitDate.trim() !== '')
    ).length;
  };

  const getStrong = () => {
    return questions.filter((q) => q.confidence === 'Strong').length;
  };

  const rows = [
    { label: 'Due Today', value: getDueToday(), colorClass: 'text-red-600 font-bold' },
    { label: 'Due This Week', value: getDueThisWeek(), colorClass: 'text-orange-600 font-bold' },
    { label: 'Revisit', value: getRevisit(), colorClass: 'text-purple-600 font-bold' },
    { label: 'Strong', value: getStrong(), colorClass: 'text-emerald-700 font-bold' }
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Revision Overview
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Calculated prep benchmarks</p>
      </div>

      <div className="divide-y divide-slate-100">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center py-2.5">
            <span className="font-semibold text-slate-600 text-sm">{row.label}</span>
            <span className={`text-base sm:text-lg ${row.colorClass}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RevisionOverview;
