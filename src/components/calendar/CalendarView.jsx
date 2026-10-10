import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Tag } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';

export const CalendarView = ({
  currentDate,
  viewMode,
  events = [],
  onEventClick,
  onDayClick
}) => {
  
  const typeClasses = {
    Interview: 'bg-blue-50 text-blue-700 border-blue-150',
    'OA / Assessment': 'bg-purple-50 text-purple-700 border-purple-150',
    'Application Deadline': 'bg-red-50 text-red-750 border-red-150',
    'Follow-up': 'bg-orange-50 text-orange-700 border-orange-150',
    Revision: 'bg-emerald-50 text-emerald-700 border-emerald-150',
    Task: 'bg-slate-100 text-slate-700 border-slate-200',
    Other: 'bg-slate-50 text-slate-500 border-slate-150'
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

  const getEventsForDate = (dateObj) => {
    const dStr = dateObj.toISOString().split('T')[0];
    return events.filter((e) => e.date === dStr);
  };


  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    
    const firstDayIndex = new Date(year, month, 1).getDay(); 
    
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();

    const prevTotalDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevTotalDays - i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= totalDays; i++) {
      const currDate = new Date(year, month, i);
      days.push({ date: currDate, isCurrentMonth: true });
    }


    const totalCells = days.length;
    const remainingCells = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="space-y-2 select-none">

        <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider py-2">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 border border-slate-200 bg-slate-200 rounded-lg overflow-hidden text-xs">
          {days.map((dayObj, index) => {
            const dateEvents = getEventsForDate(dayObj.date);
            const isToday = dayObj.date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
            
            return (
              <div
                key={index}
                className={`min-h-[120px] bg-white p-2 flex flex-col justify-between transition-colors ${
                  dayObj.isCurrentMonth ? 'text-slate-800' : 'text-slate-300 bg-slate-50/50'
                } ${isToday ? 'bg-blue-50/10 border border-primary/20' : ''}`}
              >
                {/* Day Number Header */}
                <div className="flex justify-between items-start">
                  <span
                    onClick={() => onDayClick(dayObj.date)}
                    className={`h-6.5 w-6.5 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer hover:bg-slate-100 ${
                      isToday ? 'bg-primary text-white hover:bg-primary-dark shadow-3xs' : ''
                    }`}
                  >
                    {dayObj.date.getDate()}
                  </span>
                  
                  {isToday && (
                    <span className="text-[8px] font-bold text-primary bg-blue-50 border border-blue-200 px-1 rounded uppercase tracking-wider">
                      Today
                    </span>
                  )}
                </div>

                <div className="flex-1 mt-2 space-y-1 overflow-y-auto max-h-[90px] pr-0.5 scrollbar-thin">
                  {dateEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onEventClick(evt)}
                      className={`truncate rounded border px-1.5 py-0.5 text-[9px] font-medium leading-none cursor-pointer hover:shadow-3xs transition-shadow ${
                        typeClasses[evt.type] || 'bg-slate-100'
                      } ${evt.status === 'completed' ? 'line-through opacity-60' : ''}`}
                      title={`${evt.title} (${evt.allDay ? 'All Day' : evt.startTime})`}
                    >
                      {!evt.allDay && <span className="font-semibold mr-0.5">{evt.startTime}</span>}
                      <span>{evt.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  
  const renderWeekView = () => {
    
    const currentDay = currentDate.getDay();
    const distance = currentDay === 0 ? -6 : 1 - currentDay; 
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + distance + i);
      weekDays.push(day);
    }

    const weekdaysNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-xs">
        {weekDays.map((day, idx) => {
          const dateEvents = getEventsForDate(day);
          const isToday = day.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
          
          return (
            <div
              key={idx}
              className={`rounded-lg border p-3 flex flex-col min-h-[300px] bg-slate-50/30 ${
                isToday ? 'border-primary/30 bg-blue-50/5' : 'border-slate-200 bg-white'
              }`}
            >
              
              <div className="border-b border-slate-100 pb-2 mb-3 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {weekdaysNames[idx]}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5">
                    {day.getDate()}
                  </span>
                </div>
                {isToday && (
                  <span className="rounded bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 shadow-3xs uppercase tracking-wide">
                    Today
                  </span>
                )}
              </div>

              
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[350px] pr-0.5">
                {dateEvents.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-10 text-center rounded border border-dashed border-slate-150 bg-slate-50/20">
                    <span className="text-[10px] text-slate-400">No events</span>
                  </div>
                ) : (
                  dateEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => onEventClick(evt)}
                      className={`rounded-md border p-2 cursor-pointer hover:shadow-2xs transition-all ${
                        typeClasses[evt.type] || 'bg-slate-100 text-slate-700'
                      } ${evt.status === 'completed' ? 'line-through opacity-60' : ''}`}
                    >
                      <h4 className="font-bold truncate leading-snug">{evt.title}</h4>
                      <div className="mt-1 flex items-center space-x-1 text-[9px] opacity-75 font-semibold">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{evt.allDay ? 'All Day' : evt.startTime}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  
  const renderDayView = () => {
    const dateEvents = getEventsForDate(currentDate);

    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4 max-w-2xl mx-auto">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Schedule for {formatDate(currentDate.toISOString().split('T')[0])}
            </h3>
            <p className="text-[10px] text-slate-450 mt-0.5">List of all placement events for the selected day</p>
          </div>
          <span className="rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-3xs">
            {dateEvents.length} Events
          </span>
        </div>

        <div className="space-y-3">
          {dateEvents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-150 rounded-lg bg-slate-50/20">
              <CalendarIcon className="h-8 w-8 text-slate-350 mx-auto mb-2" />
              <span className="text-slate-400 font-medium">No events scheduled for this date.</span>
            </div>
          ) : (
            dateEvents.map((evt) => {
              const timeRange = evt.allDay ? 'All Day' : `${evt.startTime} – ${evt.endTime || 'End Time'}`;
              return (
                <div
                  key={evt.id}
                  onClick={() => onEventClick(evt)}
                  className={`rounded-md border p-3 cursor-pointer hover:shadow-2xs transition-all flex items-start space-x-3 ${
                    typeClasses[evt.type] || 'bg-slate-100'
                  } ${evt.status === 'completed' ? 'opacity-60' : ''}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${typeDotColor[evt.type] || 'bg-slate-400'}`} />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold text-slate-900 leading-snug ${evt.status === 'completed' ? 'line-through' : ''}`}>
                      {evt.title}
                    </h4>
                    
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] text-slate-500 font-medium">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{timeRange}</span>
                      </span>
                      {evt.companyName && (
                        <span>Company: <strong className="text-slate-700">{evt.companyName}</strong></span>
                      )}
                      <span className="uppercase tracking-wider font-bold">Priority: {evt.priority}</span>
                    </div>

                    {evt.description && (
                      <p className="mt-2 text-[10px] text-slate-500 line-clamp-2 leading-relaxed border-t border-slate-200/50 pt-1.5">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  switch (viewMode) {
    case 'month':
      return renderMonthView();
    case 'week':
      return renderWeekView();
    case 'day':
      return renderDayView();
    default:
      return renderMonthView();
  }
};
export default CalendarView;
