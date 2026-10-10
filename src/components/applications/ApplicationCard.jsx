import React from 'react';
import { MapPin, Calendar, Hash, ArrowRight } from 'lucide-react';


export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const day = parts[2];
  const year = parts[0];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const month = months[monthIdx] || parts[1];

  return `${day} ${month} ${year}`;
};


export const ApplicationCard = ({ application, onClick }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', application.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const statusBadgeClass = {
    Applied: 'bg-slate-100 text-slate-700 border-slate-200',
    OA: 'bg-purple-50 text-purple-700 border-purple-200',
    Interview: 'bg-blue-50 text-primary border-blue-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }[application.status] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-350 hover:shadow-xs cursor-grab active:cursor-grabbing transition-all duration-150 select-none"
    >
      <div>
        
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {application.companyName}
          </h4>
          <span className={`rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider shrink-0 ${statusBadgeClass}`}>
            {application.status}
          </span>
        </div>

        
        <h5 className="text-xs font-semibold text-slate-700 line-clamp-2 leading-snug mb-3">
          {application.role}
        </h5>
      </div>


      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        {application.location && (
          <div className="flex items-center text-[10px] text-slate-400">
            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
        )}

        <div className="flex items-center text-[10px] text-slate-400">
          <Calendar className="mr-1 h-3.5 w-3.5 shrink-0" />
          <span>Applied · {formatDate(application.appliedDate)}</span>
        </div>

      </div>

      
      <div className="absolute bottom-4 right-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
};
export default ApplicationCard;
