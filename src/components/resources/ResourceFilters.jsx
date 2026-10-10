import React from 'react';
import { Search, X, Star } from 'lucide-react';

export const RESOURCE_TYPES = [
  'Document',
  'Note',
  'Email Template',
  'Message Template',
  'Link',
  'Checklist'
];

/**
 * Modern SaaS-style filter bar for searching, typing, and sorting resources.
 */
export const ResourceFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  favFilter,
  onFavFilterChange,
  sortBy,
  onSortByChange,
  onClearFilters,
  hasActiveFilters
}) => {
  const sortOptions = [
    { value: 'Recently Updated', label: 'Recently Updated' },
    { value: 'Recently Created', label: 'Recently Created' },
    { value: 'Title A-Z', label: 'Alphabetical (A–Z)' },
    { value: 'Title Z-A', label: 'Alphabetical (Z–A)' },
    { value: 'Most Used', label: 'Most Used' }
  ];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs md:flex-row md:items-center md:justify-between text-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resources, documents, notes, links..."
          className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-8 text-slate-900 placeholder-slate-400 text-xs focus:bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Select Controls & Toggles */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 text-xs shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="All">All Types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Favorites Toggle */}
        <button
          onClick={() => onFavFilterChange(favFilter === 'Favorites Only' ? 'All' : 'Favorites Only')}
          type="button"
          className={`flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-all ${
            favFilter === 'Favorites Only'
              ? 'border-amber-300 bg-amber-50 text-amber-700'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
          }`}
          title="Toggle Favorites Only"
        >
          <Star className={`h-3.5 w-3.5 ${favFilter === 'Favorites Only' ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
          <span>Favorites</span>
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5">
          <label className="hidden sm:inline text-slate-400 font-medium whitespace-nowrap">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 text-xs shadow-2xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button if any filter is active */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            type="button"
            className="text-xs font-semibold text-primary hover:text-primary-dark underline ml-1"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceFilters;
