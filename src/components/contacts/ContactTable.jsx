import React from 'react';
import { ExternalLink, Mail, Star, StarOff } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';

/**
 * Tabular CRM contacts directory layout.
 * Maps visible headers dynamically to fit core fields and custom user-defined fields.
 */
export const ContactTable = ({
  contacts = [],
  visibleColumns = [],
  customFieldsMeta = [],
  onOpenDetails,
  onToggleFav,
  baseDate = new Date().toISOString().split('T')[0]
}) => {
  
  // Header details helper
  const getHeaderLabel = (key) => {
    const coreMap = {
      name: 'Name',
      company: 'Company',
      role: 'Role',
      email: 'Email',
      contactType: 'Type',
      status: 'Status',
      followUpDate: 'Follow-up',
      source: 'Source',
      linkedin: 'LinkedIn',
      notes: 'Notes'
    };

    if (coreMap[key]) return coreMap[key];
    const custom = customFieldsMeta.find((f) => f.id === key);
    return custom ? custom.name : key;
  };

  // Cell rendering logic based on key
  const renderCell = (c, key) => {
    if (key === 'name') {
      return (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(c.id); }}
            className="text-slate-350 hover:text-amber-500 transition-colors"
          >
            <Star className={`h-4 w-4 ${c.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
          <span className="font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer" onClick={() => onOpenDetails(c.id)}>
            {c.name}
          </span>
        </div>
      );
    }

    if (key === 'company') return <span className="font-bold text-slate-800">{c.company}</span>;
    if (key === 'role') return <span className="font-medium text-slate-500">{c.role || '-'}</span>;
    
    if (key === 'email') {
      return c.email ? (
        <a
          href={`mailto:${c.email}`}
          className="flex items-center space-x-1 hover:text-primary font-semibold truncate max-w-[130px]"
          title="Send Email"
        >
          <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>{c.email}</span>
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      );
    }

    if (key === 'contactType') {
      const typeStyles = {
        HR: 'bg-slate-100 text-slate-700',
        Recruiter: 'bg-blue-50 text-blue-700',
        'Hiring Manager': 'bg-purple-50 text-purple-700',
        Employee: 'bg-indigo-50 text-indigo-700',
        Referral: 'bg-emerald-50 text-emerald-700',
        Other: 'bg-slate-50 text-slate-500'
      };
      return (
        <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${typeStyles[c.contactType] || 'bg-slate-50 text-slate-500'}`}>
          {c.contactType}
        </span>
      );
    }

    if (key === 'status') {
      const statusStyles = {
        New: 'bg-blue-50 text-blue-700 border-blue-100',
        Contacted: 'bg-amber-50 text-amber-700 border-amber-100',
        Replied: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Follow-up': 'bg-rose-50 text-rose-700 border-rose-100',
        Closed: 'bg-slate-50 text-slate-400 border-slate-200'
      };
      return (
        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${statusStyles[c.status] || 'bg-slate-50 text-slate-500'}`}>
          {c.status}
        </span>
      );
    }

    if (key === 'followUpDate') {
      if (!c.followUpDate) return <span className="text-slate-400">-</span>;
      
      const isClosed = c.status === 'Closed';
      const isPast = c.followUpDate < baseDate;
      const isToday = c.followUpDate === baseDate;
      
      let dateStyle = 'text-slate-600';
      if (!isClosed) {
        if (isPast) dateStyle = 'text-red-600 font-bold bg-red-50 border border-red-100 rounded px-1.5 py-0.5';
        else if (isToday) dateStyle = 'text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5';
      }

      return <span className={`text-[10px] tracking-wide ${dateStyle}`}>{formatDate(c.followUpDate)}</span>;
    }

    if (key === 'source') return <span className="text-slate-500 font-medium">{c.source}</span>;
    
    if (key === 'linkedin') {
      return c.linkedin ? (
        <a
          href={c.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-dark transition-colors inline-flex items-center space-x-0.5 font-bold"
        >
          <span>View</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ) : (
        <span className="text-slate-400">-</span>
      );
    }

    if (key === 'notes') {
      return (
        <p className="truncate max-w-[140px] text-slate-450 font-medium" title={c.notes}>
          {c.notes || '-'}
        </p>
      );
    }

    // Render Custom User Fields
    if (c.customFields && c.customFields[key] !== undefined) {
      const val = c.customFields[key];
      if (typeof val === 'boolean') {
        return (
          <span className={`font-bold ${val ? 'text-emerald-650' : 'text-slate-400'}`}>
            {val ? 'Yes' : 'No'}
          </span>
        );
      }
      return <span className="text-slate-655 truncate max-w-[110px] block">{val || '-'}</span>;
    }

    return <span className="text-slate-400">-</span>;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-3xs text-xs font-semibold">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <tr>
            {visibleColumns.map((colKey) => (
              <th key={colKey} scope="col" className="px-5 py-3 text-left">
                {getHeaderLabel(colKey)}
              </th>
            ))}
            <th scope="col" className="relative px-5 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {contacts.map((c) => (
            <tr
              key={c.id}
              onClick={() => onOpenDetails(c.id)}
              className="hover:bg-slate-50/50 transition-colors cursor-pointer"
            >
              {visibleColumns.map((colKey) => (
                <td key={colKey} className="px-5 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                  {renderCell(c, colKey)}
                </td>
              ))}
              <td className="px-5 py-3.5 whitespace-nowrap text-right text-[10px] font-bold shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenDetails(c.id); }}
                  type="button"
                  className="text-primary hover:text-primary-dark transition-colors"
                >
                  View CRM →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ContactTable;
