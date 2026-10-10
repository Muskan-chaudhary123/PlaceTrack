import React from 'react';
import { Target } from 'lucide-react';

/**
 * Minimal professional branding logo component for PlaceTrack.
 */
export const Logo = ({ className = '', iconSize = 20, fontSize = 'text-lg' }) => {
  return (
    <div className={`flex items-center space-x-2 text-slate-900 ${className}`}>
      <div className="flex items-center justify-center rounded bg-primary p-1.5 text-white">
        <Target size={iconSize} className="stroke-[2.5]" />
      </div>
      <span className={`font-semibold tracking-tight ${fontSize}`}>
        PlaceTrack
      </span>
    </div>
  );
};
