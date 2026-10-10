import React from 'react';
import { Search } from 'lucide-react';

export const ApplicationFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  locationFilter,
  onLocationFilterChange,
  sortBy,
  onSortByChange,
  viewMode = 'list',
  onViewModeChange,
  locations = []
}) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
      {/* Left side: Search & Filter inputs */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, role or location..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="OA">OA</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Selected</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => onLocationFilterChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary max-w-[150px]"
          >
            <option value="All">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
  
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="recently-applied">Recently Applied</option>
            <option value="oldest">Oldest</option>
            <option value="company-a-z">Company A-Z</option>
            <option value="company-z-a">Company Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};
export default ApplicationFilters;
