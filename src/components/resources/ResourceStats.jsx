import React from 'react';
import { Files, Mail, BookOpen, Star } from 'lucide-react';

/**
 * Metric cards summarizing the current Placement Knowledge Base statistics.
 */
export const ResourceStats = ({ resources = [] }) => {
  const total = resources.length;
  
  const templates = resources.filter(
    (r) => r.type === 'Email Template' || r.type === 'Message Template'
  ).length;

  const studyNotes = resources.filter(
    (r) => r.category === 'Study Notes' || r.category === 'CS Fundamentals'
  ).length;

  const favorites = resources.filter((r) => r.favorite).length;

  const cards = [
    {
      label: 'Total Resources',
      value: total,
      icon: Files,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50/50'
    },
    {
      label: 'Templates',
      value: templates,
      icon: Mail,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50/50'
    },
    {
      label: 'Study Notes',
      value: studyNotes,
      icon: BookOpen,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50/50'
    },
    {
      label: 'Favorites',
      value: favorites,
      icon: Star,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50/50'
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
export default ResourceStats;
