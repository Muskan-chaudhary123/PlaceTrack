import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/Button';


export const CalendarToolbar = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onNavigate,
  onTodayClick
}) => {
  
  const getPeriodHeader = () => {
    const options = { month: 'long', year: 'numeric' };
    
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', options);
    }
    
    if (viewMode === 'week') {
      
      const currentDay = currentDate.getDay();
      const distance = currentDay === 0 ? -6 : 1 - currentDay;
      
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() + distance);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
      const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
      const year = startOfWeek.getFullYear();

      if (startMonth === endMonth) {
        return `${startMonth} ${startOfWeek.getDate()} – ${endOfWeek.getDate()}, ${year}`;
      }
      return `${startMonth} ${startOfWeek.getDate()} – ${endMonth} ${endOfWeek.getDate()}, ${year}`;
    }
    
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }

    return '';
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between text-xs font-semibold">
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" onClick={onTodayClick} className="py-1.5 px-3">
          Today
        </Button>
        
        <div className="flex items-center border border-slate-200 rounded-md bg-slate-50 p-0.5">
          <button
            onClick={() => onNavigate('prev')}
            type="button"
            className="rounded-md p-1.5 hover:bg-white hover:text-slate-900 text-slate-500 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onNavigate('next')}
            type="button"
            className="rounded-md p-1.5 hover:bg-white hover:text-slate-900 text-slate-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-slate-900 pl-2 leading-none">
          {getPeriodHeader()}
        </h3>
      </div>

      <div className="flex items-center border border-slate-200 rounded-md p-0.5 bg-slate-50 self-start sm:self-auto">
        {['month', 'week', 'day'].map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            type="button"
            className={`rounded-md px-3 py-1.5 capitalize transition-all duration-150 ${
              viewMode === mode
                ? 'bg-white text-primary shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
};
export default CalendarToolbar;
