import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';


export const UpcomingEvents = ({ events = [], onEventClick }) => {
  
  const upcomingEvents = [...events]
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const getDayHeading = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    
    const tomorrowObj = new Date();
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrow = tomorrowObj.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === tomorrow) return 'Tomorrow';

    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    return `${parts[2]} ${month}`;
  };

  const typeDotColor = {
    Interview: 'bg-blue-600',
    'OA / Assessment': 'bg-purple-500',
    'Application Deadline': 'bg-red-500',
    'Follow-up': 'bg-orange-400',
    Revision: 'bg-emerald-500',
    Task: 'bg-slate-400',
    Other: 'bg-slate-300'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4 h-full">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
          Upcoming Events
        </h3>
        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Chronological timeline of placement goals</p>
      </div>

      <div className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-450 italic">
            No upcoming events.
          </div>
        ) : (
          upcomingEvents.map((evt) => {
            const timeStr = evt.allDay ? 'All Day' : evt.startTime || 'Scheduled';
            return (
              <div key={evt.id} className="space-y-1">
                
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1 mb-1.5">
                  {getDayHeading(evt.date)}
                </span>
               
                <div
                  onClick={() => onEventClick(evt)}
                  className="group rounded-md border border-slate-100 bg-slate-50/50 p-2.5 hover:border-slate-200 hover:bg-slate-100/30 transition-all cursor-pointer flex items-start space-x-2"
                >
                  <span className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 ${typeDotColor[evt.type] || 'bg-slate-300'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate leading-snug group-hover:text-primary transition-colors">
                      {evt.title}
                    </h4>
                    <div className="mt-1 flex items-center space-x-3 text-[9px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        <span>{timeStr}</span>
                      </span>
                      <span className="bg-white border border-slate-200 rounded px-1 text-[8px] uppercase tracking-wide truncate">
                        {evt.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default UpcomingEvents;
