import React from 'react';
import { Search } from 'lucide-react';

/**
 * Filter panel for searching, narrowing, and sorting interview questions.
 */
export const QuestionFilters = ({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  revision,
  onRevisionChange,
  revisit,
  onRevisitChange
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between text-xs font-semibold">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search questions or topics..."
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-slate-905 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Revision */}
        <select
          value={revision}
          onChange={(e) => onRevisionChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Revision</option>
          <option value="Yes">Needs Revision</option>
          <option value="No">No Revision</option>
        </select>

        {/* Revisit */}
        <select
          value={revisit}
          onChange={(e) => onRevisitChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Revisit</option>
          <option value="Yes">Needs Revisit</option>
          <option value="No">No Revisit</option>
        </select>
      </div>
    </div>
  );
};
export default QuestionFilters;
