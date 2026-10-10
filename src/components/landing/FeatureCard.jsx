import React from 'react';

/**
 * Feature card component with a clean, minimal design, matching the design guidelines.
 */
export const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-sm">
      <div className="mb-4 inline-flex items-center justify-center rounded-md bg-slate-50 p-3 text-primary transition-colors group-hover:bg-blue-50 group-hover:text-primary-dark">
        <Icon className="h-6 w-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
