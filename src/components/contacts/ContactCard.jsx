import React from 'react';
import { Star, Mail, ExternalLink } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';

/**
 * Compact mobile CRM contact fallback card.
 */
export const ContactCard = ({
  contact,
  onOpenDetails,
  onToggleFav,
  baseDate = new Date().toISOString().split('T')[0]
}) => {
  const c = contact;

  const typeStyles = {
    HR: 'bg-slate-100 text-slate-700',
    Recruiter: 'bg-blue-50 text-blue-700',
    'Hiring Manager': 'bg-purple-50 text-purple-700',
    Employee: 'bg-indigo-50 text-indigo-700',
    Referral: 'bg-emerald-50 text-emerald-700',
    Other: 'bg-slate-50 text-slate-500'
  };

  const statusStyles = {
    New: 'bg-blue-50 text-blue-700 border-blue-100',
    Contacted: 'bg-amber-50 text-amber-700 border-amber-100',
    Replied: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Follow-up': 'bg-rose-50 text-rose-700 border-rose-100',
    Closed: 'bg-slate-50 text-slate-400 border-slate-200'
  };

  // Follow-up status check
  const getFollowUpStatus = () => {
    if (!c.followUpDate) return null;
    const isClosed = c.status === 'Closed';
    const isPast = c.followUpDate < baseDate;
    const isToday = c.followUpDate === baseDate;
    
    let dateStyle = 'text-slate-655';
    if (!isClosed) {
      if (isPast) dateStyle = 'text-red-655 font-bold bg-red-50 border border-red-100 rounded px-1.5 py-0.5';
      else if (isToday) dateStyle = 'text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5';
    }
    return <span className={`text-[10px] ${dateStyle}`}>{formatDate(c.followUpDate)}</span>;
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4.5 shadow-3xs flex flex-col justify-between h-full space-y-4 text-xs font-semibold">
      
      {/* Name and company header */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-start">
          <div>
            <h4
              onClick={() => onOpenDetails(c.id)}
              className="font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer text-sm"
            >
              {c.name}
            </h4>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              {c.company} {c.role ? `· ${c.role}` : ''}
            </div>
          </div>
          
          <button
            onClick={() => onToggleFav(c.id)}
            type="button"
            className="text-slate-350 hover:text-amber-500 transition-colors"
          >
            <Star className={`h-4.5 w-4.5 ${c.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Email */}
        {c.email && (
          <a
            href={`mailto:${c.email}`}
            className="flex items-center space-x-1.5 text-slate-500 hover:text-primary font-medium mt-1 truncate"
          >
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-[11px] truncate">{c.email}</span>
          </a>
        )}
      </div>

      {/* Badges and Dates Row */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center space-x-2">
          <span className={`rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${typeStyles[c.contactType] || 'bg-slate-50'}`}>
            {c.contactType}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${statusStyles[c.status] || 'bg-slate-50 text-slate-500'}`}>
            {c.status}
          </span>
        </div>

        {c.followUpDate && (
          <div className="flex items-center space-x-1 font-bold text-[9px] text-slate-400 uppercase tracking-wider">
            <span>Follow-up:</span>
            {getFollowUpStatus()}
          </div>
        )}
      </div>

      {/* Custom Fields Excerpts (Limit to top 2 fields for space) */}
      {c.customFields && Object.keys(c.customFields).length > 0 && (
        <div className="pt-2 border-t border-slate-50 space-y-1 text-[10px] font-medium text-slate-500">
          {Object.entries(c.customFields).slice(0, 2).map(([key, val]) => {
            if (val === undefined || val === '') return null;
            const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val;
            return (
              <div key={key} className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">{key.replace(/_/g, ' ')}</span>
                <span className="text-slate-805 font-bold truncate max-w-[120px]">{displayVal}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-3 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => onOpenDetails(c.id)}
          type="button"
          className="text-primary hover:text-primary-dark transition-colors text-[10px] font-bold uppercase tracking-wider"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};
export default ContactCard;
