import React from 'react';

export const RESOURCE_CATEGORIES = [
  'Email Templates',
  'Referral Templates',
  'Recruiter Messages',
  'Resume',
  'CS Fundamentals',
  'Interview Preparation',
  'Project Notes',
  'Study Notes',
  'Useful Links',
  'Personal'
];

/**
 * Compact, horizontally scrollable category chips for resource filtering.
 */
export const ResourceCategories = ({ selectedCategory, onSelectCategory, categoryCounts = {} }) => {
  const allCategories = ['All', ...RESOURCE_CATEGORIES];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-medium">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat];

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              type="button"
              className={`shrink-0 rounded-full px-3.5 py-1.5 transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-primary text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] rounded-full px-1.5 py-0.2 font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceCategories;
