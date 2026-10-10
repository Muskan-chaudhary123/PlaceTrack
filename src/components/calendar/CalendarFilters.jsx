import React from 'react';
import { Search } from 'lucide-react';


export const CalendarFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  statusFilter,
  onStatusFilterChange
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
      
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events, company or description..."
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      
      <div className="flex flex-wrap items-center gap-3">

        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Types</option>
          <option value="Interview">Interview</option>
          <option value="OA / Assessment">OA / Assessment</option>
          <option value="Application Deadline">Application Deadline</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Revision">Revision</option>
          <option value="Task">Task</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};
export default CalendarFilters;
