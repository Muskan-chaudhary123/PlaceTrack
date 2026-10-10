import React from 'react';
import { Eye, Edit, Trash2, Calendar, Award } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';

/**
 * Mobile-friendly card showing a single question and its meta parameters.
 */
export const QuestionCard = ({ question, onView, onEdit, onDelete }) => {
  const q = question;

  const difficultyColors = {
    Easy: 'text-emerald-600 font-semibold',
    Medium: 'text-amber-600 font-semibold',
    Hard: 'text-red-600 font-semibold'
  };

  const confidenceClasses = {
    "Don't Know": 'bg-red-50 text-red-750 border-red-200',
    'Need Revision': 'bg-orange-50 text-orange-755 border-orange-200',
    Comfortable: 'bg-blue-50 text-blue-750 border-blue-200',
    Strong: 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold'
  };

  const freqAsked = q.companyIds && q.companyIds.length >= 3;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-3xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4 text-xs font-semibold">
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {q.category} {q.topic ? `· ${q.topic}` : ''}
          </span>
          <span className={`rounded border px-2 py-0.5 text-[8px] uppercase tracking-wide shrink-0 ${confidenceClasses[q.confidence] || 'bg-slate-50'}`}>
            {q.confidence}
          </span>
        </div>

        <h4
          onClick={() => onView(q.id)}
          className="font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer leading-relaxed text-xs line-clamp-3"
        >
          {q.question}
        </h4>
      </div>

      {/* Meta rows */}
      <div className="space-y-2 pt-2 border-t border-slate-100 font-medium text-slate-500">
        <div className="flex justify-between">
          <span>Difficulty</span>
          <span className={difficultyColors[q.difficulty] || 'text-slate-655'}>
            {q.difficulty}
          </span>
        </div>

        {q.nextRevision && (
          <div className="flex justify-between">
            <span>Next Revision</span>
            <span className="text-slate-700 flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-slate-450" />
              <span>{formatDate(q.nextRevision)}</span>
            </span>
          </div>
        )}

        {q.companyIds && q.companyIds.length > 0 && (
          <div className="flex justify-between items-center gap-2">
            <span>Asked By</span>
            <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
              {q.companyIds.slice(0, 2).map((c, i) => (
                <span key={i} className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                  {c}
                </span>
              ))}
              {freqAsked && (
                <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider shrink-0">
                  Frequent
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
        <button
          onClick={() => onView(q.id)}
          className="flex items-center space-x-1 rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(q)}
          className="flex items-center space-x-1 rounded border border-slate-200 px-2 py-1 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <Edit className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(q.id)}
          className="flex items-center space-x-1 rounded border border-red-150 px-2 py-1 text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
export default QuestionCard;
