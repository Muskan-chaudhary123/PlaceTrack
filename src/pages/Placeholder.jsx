import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

export const Placeholder = () => {
  const location = useLocation();
  
  
  const routeName = location.pathname
    .substring(1)
    .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
        <Construction className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{routeName} Module</h2>
      <p className="text-slate-600 text-sm sm:text-base max-w-md mb-6">
        This section is coming soon in the next stage. You will be able to manage this part of your placement journey here.
      </p>
      <div className="text-sm text-slate-500 font-mono border border-dashed border-slate-200 px-3 py-1.5 rounded-md">
        Path: {location.pathname}
      </div>
    </div>
  );
};
