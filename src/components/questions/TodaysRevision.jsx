import React from 'react';
import { ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Sidebar component listing questions due for revision today with a launch button for Revision Mode.
 */
export const TodaysRevision = ({ questions = [], onViewQuestion, onStartRevision }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysRevisionList = questions.filter(
    (q) => q.nextRevision && q.nextRevision <= todayStr && q.revisionStatus !== 'Revised'
  );

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Hard: 'bg-red-50 text-red-700 border-red-100'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Today's Revision
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Focus items due today</p>
        </div>
        <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-xs font-semibold shadow-3xs">
          {todaysRevisionList.length} Due
        </span>
      </div>

      <div className="space-y-3">
        {todaysRevisionList.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-medium italic border border-dashed border-slate-100 rounded-md bg-slate-50/30">
            All caught up! No revisions due today.
          </div>
        ) : (
          <>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5">
              {todaysRevisionList.slice(0, 5).map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => onViewQuestion(q.id)}
                  className="group flex items-start space-x-2 rounded border border-slate-100 bg-slate-50/50 p-2.5 hover:border-slate-200 hover:bg-slate-100/30 transition-all cursor-pointer min-w-0"
                >
                  <span className="font-bold text-slate-400 mt-0.5 text-sm">{idx + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm truncate leading-snug group-hover:text-primary transition-colors">
                      {q.question}
                    </h4>
                    <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500 font-medium">
                      <span>{q.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className={`px-1.5 py-0.5 rounded border text-xs ${difficultyColors[q.difficulty] || 'bg-slate-100'}`}>
                        {q.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {todaysRevisionList.length > 5 && (
                <div className="text-center text-xs text-slate-500 font-medium pt-1">
                  + {todaysRevisionList.length - 5} more questions
                </div>
              )}
            </div>

            <Button
              onClick={onStartRevision}
              className="w-full text-sm py-2 px-3 flex items-center justify-center space-x-1.5 border-transparent shadow-xs"
            >
              <BookOpen className="h-4 w-4" />
              <span>Start Revision</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
export default TodaysRevision;
