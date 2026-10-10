import React from 'react';

/**
 * Horizontally scrollable list of category tab selectors.
 */
export const QuestionCategories = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    'All',
    'DSA',
    'OOP',
    'DBMS',
    'OS',
    'Computer Networks',
    'System Design',
    'Python',
    'JavaScript',
    'Django',
    'SQL',
    'HR',
    'Behavioral',
    'Company Specific'
  ];

  return (
    <div className="border-b border-slate-200">
      <div className="flex overflow-x-auto no-scrollbar py-1 -mb-px space-x-5 text-xs font-semibold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            type="button"
            className={`pb-3 border-b-2 px-1 whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-655 hover:border-slate-350'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
export default QuestionCategories;
