import React from 'react';
import { Search } from 'lucide-react';

/**
 * Filter panel for searching and narrowing CRM contacts lists.
 */
export const ContactFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  companyFilter,
  onCompanyFilterChange,
  statusFilter,
  onStatusFilterChange,
  followUpFilter,
  onFollowUpFilterChange,
  sortBy,
  onSortByChange,
  companies = []
}) => {
  const types = ['All', 'HR', 'Recruiter', 'Hiring Manager', 'Employee', 'Referral', 'Other'];
  const statuses = ['All', 'New', 'Contacted', 'Replied', 'Follow-up', 'Closed'];
  const followUpOptions = [
    { value: 'All', label: 'All Follow-ups' },
    { value: 'No Follow-up', label: 'No Follow-up Scheduled' },
    { value: 'Due Today', label: 'Due Today' },
    { value: 'Due Soon', label: 'Due Soon (3 days)' },
    { value: 'Overdue', label: 'Overdue' }
  ];

  const sortOptions = [
    { value: 'Recently Added', label: 'Recently Added' },
    { value: 'Name A-Z', label: 'Name A-Z' },
    { value: 'Name Z-A', label: 'Name Z-A' },
    { value: 'Company A-Z', label: 'Company A-Z' },
    { value: 'Follow-up Date', label: 'Follow-up Date' },
    { value: 'Most Contacted', label: 'Most Contacted' }
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs text-xs font-semibold">
      {/* Top Row: Search and Sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, company, email, role, notes..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-slate-900 placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-slate-400 font-bold mr-2 uppercase tracking-wide text-[9px]">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bottom Row: Detailed Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
        {/* Type Filter */}
        <div>
          <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wide text-[9px]">Contact Type</label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {types.map((t) => (
              <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>

        {/* Company Filter */}
        <div>
          <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wide text-[9px]">Company</label>
          <select
            value={companyFilter}
            onChange={(e) => onCompanyFilterChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary max-w-[150px]"
          >
            <option value="All">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wide text-[9px]">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>

        {/* Follow-up Filter */}
        <div>
          <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wide text-[9px]">Follow-up</label>
          <select
            value={followUpFilter}
            onChange={(e) => onFollowUpFilterChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {followUpOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
export default ContactFilters;
