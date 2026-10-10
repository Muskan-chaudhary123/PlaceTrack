import React from 'react';
import { Search } from 'lucide-react';

/**
 * Filter panel for searching, sorting, and narrowing down interview lists by result or round.
 */
export const InterviewFilters = ({
  search,
  onSearchChange,
  resultFilter,
  onResultFilterChange,
  roundFilter,
  onRoundFilterChange,
  sortBy,
  onSortByChange
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search company or role..."
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Result Filter */}
        <select
          value={resultFilter}
          onChange={(e) => onResultFilterChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Results</option>
          <option value="Pending">Pending</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
          <option value="On Hold">On Hold</option>
        </select>

        {/* Round Filter */}
        <select
          value={roundFilter}
          onChange={(e) => onRoundFilterChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Rounds</option>
          <option value="HR">HR</option>
          <option value="OA">OA</option>
          <option value="Technical">Technical</option>
          <option value="Managerial">Managerial</option>
          <option value="System Design">System Design</option>
          <option value="Final">Final</option>
        </select>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="upcoming">Upcoming First</option>
          <option value="most-recent">Most Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
};
export default InterviewFilters;
