import React from 'react';
import { BookOpen, AlertCircle, Calendar, CheckCircle } from 'lucide-react';

/**
 * Metric cards summarizing the current Question Bank status.
 */
export const QuestionStats = ({ questions = [] }) => {
  const total = questions.length;
  
  const needRevision = questions.filter(
    (q) => q.confidence === 'Need Revision' || q.confidence === "Don't Know"
  ).length;

  const revisit = questions.filter(
    (q) => q.revisionStatus === 'Revisit' || (q.revisitDate && q.revisitDate.trim() !== '')
  ).length;

  const strong = questions.filter((q) => q.confidence === 'Strong').length;

  const cards = [
    {
      label: 'Total Questions',
      value: total,
      icon: BookOpen,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50/50'
    },
    {
      label: 'Need Revision',
      value: needRevision,
      icon: AlertCircle,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50/50'
    },
    {
      label: 'Revisit Scheduled',
      value: revisit,
      icon: Calendar,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50/50'
    },
    {
      label: 'Strong Concepts',
      value: strong,
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/50'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-lg border border-slate-200 bg-white p-4.5 shadow-3xs flex items-center justify-between"
          >
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {card.label}
              </span>
              <span className="block text-lg font-bold text-slate-900 mt-1 leading-none">
                {card.value}
              </span>
            </div>
            <div className={`rounded-md p-2 ${card.bgColor} shrink-0`}>
              <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default QuestionStats;
