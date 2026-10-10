import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { formatDate } from './ApplicationCard';


export const ApplicationList = ({ applications = [], onCardClick }) => {
  const statusBadgeClass = {
    Applied: 'bg-slate-100 text-slate-700 border-slate-200',
    OA: 'bg-purple-50 text-purple-700 border-purple-200',
    Interview: 'bg-blue-50 text-primary border-blue-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-4">Company</th>
              <th scope="col" className="px-6 py-4">Role</th>
              <th scope="col" className="px-6 py-4">Location</th>
              <th scope="col" className="px-6 py-4">Applied</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                  No applications match the filters.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Company Name */}
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                    {app.companyName}
                  </td>
                  
                  {/* Role Title */}
                  <td className="px-6 py-4 max-w-[200px] truncate font-medium text-slate-700">
                    {app.role}
                  </td>
                  
                  {/* Location */}
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-500">
                    {app.location || '—'}
                  </td>
                  
                  {/* Applied Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-slate-450 font-medium">
                    {formatDate(app.appliedDate)}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded border px-2 py-0.5 font-semibold text-[9px] uppercase tracking-wide ${
                      statusBadgeClass[app.status] || 'bg-slate-100 text-slate-750'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      onClick={() => onCardClick(app)}
                      type="button"
                      className="inline-flex items-center space-x-1 font-semibold text-primary hover:text-primary-dark transition-colors bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1 rounded"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ApplicationList;
