import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, ExternalLink, ShieldAlert, Award, Tag } from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from '../applications/ApplicationCard';


export const EventDetails = ({ event, onClose, onEdit, onDelete, onComplete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!event) return null;

  const isDerived = event.id.startsWith('derived-');
  const isInterview = event.type === 'Interview';
  const isDeadline = event.type === 'Application Deadline';

  const typeColorDot = {
    Interview: 'bg-blue-600',
    'OA / Assessment': 'bg-purple-500',
    'Application Deadline': 'bg-red-500',
    'Follow-up': 'bg-orange-400',
    Revision: 'bg-emerald-500',
    Task: 'bg-slate-400',
    Other: 'bg-slate-300'
  }[event.type] || 'bg-slate-300';

  const priorityColors = {
    Low: 'bg-slate-50 text-slate-500 border-slate-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-250',
    High: 'bg-red-50 text-red-750 border-red-200 font-bold'
  }[event.priority] || 'bg-slate-50 text-slate-500 border-slate-200';

  const timeStr = event.allDay ? 'All Day' : `${event.startTime} – ${event.endTime || 'End Time'}`;

  const handleDeleteConfirm = () => {
    onDelete(event.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl animate-slide-in-right">
        
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center space-x-2.5">
            <span className={`h-3 w-3 rounded-full ${typeColorDot}`} />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {event.type} {isDerived && '(Linked Object)'}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5 truncate max-w-[280px]">
                {event.title}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-655">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
          

          <div className="space-y-4 rounded-lg border border-slate-150 bg-slate-50/50 p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</span>
                <span className="font-medium text-slate-800 text-sm sm:text-base">{formatDate(event.date)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</span>
                <span className="font-medium text-slate-800 text-sm sm:text-base">{timeStr}</span>
              </div>
            </div>

            {event.companyName && (
              <div className="flex items-center space-x-3">
                <Award className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</span>
                  <span className="font-medium text-slate-800 text-sm sm:text-base">{event.companyName}</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Tag className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</span>
                <span className={`inline-flex rounded border px-2 py-0.5 mt-0.5 text-xs font-semibold uppercase tracking-wider ${priorityColors}`}>
                  {event.priority}
                </span>
              </div>
            </div>

            {event.reminder && (
              <div className="flex items-center space-x-3">
                <Clock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Reminder alert</span>
                  <span className="font-medium text-slate-800 text-sm sm:text-base">{event.reminder}</span>
                </div>
              </div>
            )}
          </div>


          <div>
            <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">Description Notes</h4>
            <div className="rounded-lg border border-slate-200 bg-white p-4 leading-relaxed font-normal text-slate-700 text-sm whitespace-pre-wrap">
              {event.description || (
                <span className="italic text-slate-400">No descriptions logged for this event.</span>
              )}
            </div>
          </div>


          {(event.applicationId || event.interviewId) && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-sm font-semibold">
              {event.applicationId && (
                <a
                  href="/applications"
                  className="text-primary hover:text-primary-dark inline-flex items-center space-x-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Linked Application</span>
                </a>
              )}
              {event.interviewId && (
                <a
                  href={`/interviews/${event.interviewId}`}
                  className="text-primary hover:text-primary-dark inline-flex items-center space-x-1.5"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Interview Round Page</span>
                </a>
              )}
            </div>
          )}

          {isDerived && (
            <div className="rounded border border-blue-100 bg-blue-50/30 p-3 text-slate-600 font-normal text-xs sm:text-sm leading-normal">
              Note: This event is dynamically derived from your {isInterview ? 'Interview Hub' : 'Application Tracker'} data. Editing or deleting it here will modify the underlying log record.
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
          
          <div className="flex space-x-2">
            {event.status === 'upcoming' && (
              <Button
                variant="outline"
                className="bg-emerald-50 hover:bg-emerald-100/70 border-emerald-250 text-emerald-700 font-bold"
                onClick={() => { onComplete(event.id); onClose(); }}
              >
                Mark Complete
              </Button>
            )}
            <Button onClick={() => { onEdit(event); onClose(); }}>
              Edit
            </Button>
          </div>
        </div>
      </div>


      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-sm">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Delete Event?</h4>
            <p className="text-slate-600 mb-6 font-normal leading-normal">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EventDetails;
