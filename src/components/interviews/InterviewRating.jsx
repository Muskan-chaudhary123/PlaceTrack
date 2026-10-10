import React from 'react';
import { Star } from 'lucide-react';

/**
 * Self-evaluation metrics rating component (DSA, CS Fundamentals, Communication, etc.) using 1-5 star sliders.
 */
export const InterviewRating = ({ ratings = {}, onRatingsChange }) => {
  const categories = [
    { key: 'dsa', label: 'DSA' },
    { key: 'csFundamentals', label: 'CS Fundamentals' },
    { key: 'communication', label: 'Communication' },
    { key: 'problemSolving', label: 'Problem Solving' },
    { key: 'confidence', label: 'Confidence' }
  ];

  const handleStarClick = (key, val) => {
    if (!onRatingsChange) return;
    const updated = {
      ...ratings,
      [key]: val
    };
    onRatingsChange(updated);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Self Evaluation</h3>
        <p className="text-xs text-slate-500 font-medium">Rate your performance in various domains</p>
      </div>

      <div className="space-y-3.5">
        {categories.map((cat) => {
          const ratingValue = ratings[cat.key] || 0;
          return (
            <div key={cat.key} className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm sm:text-base">{cat.label}</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(cat.key, star)}
                    className="p-0.5 focus:outline-none transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= ratingValue
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200 hover:text-amber-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="inline-block text-xs font-semibold text-slate-500 w-4 text-right ml-1">
                  {ratingValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default InterviewRating;
