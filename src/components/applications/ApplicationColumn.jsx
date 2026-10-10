import React, { useState } from 'react';
import { ApplicationCard } from './ApplicationCard';

export const ApplicationColumn = ({ status, title, applications = [], onCardDrop, onCardClick }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId && onCardDrop) {
      onCardDrop(cardId, status);
    }
  };

  const titleAccentClass = {
    Applied: 'border-slate-300',
    OA: 'border-purple-300',
    Interview: 'border-blue-300',
    Rejected: 'border-red-300',
    Selected: 'border-emerald-300'
  }[status] || 'border-slate-350';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-lg border-2 p-3 transition-colors min-w-[250px] max-w-[340px] flex-1 ${
        isDragOver
          ? 'border-dashed border-primary bg-blue-50/20'
          : 'border-transparent bg-slate-50'
      }`}
    >

      <div className={`flex items-center justify-between pb-2 mb-4 border-b ${titleAccentClass}`}>
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {title}
        </h3>
        <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-3xs">
          {applications.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[150px] pr-1">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded border border-dashed border-slate-200 bg-white">
            <span className="text-[11px] text-slate-400 font-medium">
              No applications here yet.
            </span>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => onCardClick(app)}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default ApplicationColumn;
