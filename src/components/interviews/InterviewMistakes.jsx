import React, { useState } from 'react';
import { Plus, X, Trash2, AlertOctagon } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Mistakes tracker rendering logged mistakes, offering inline addition and removal.
 */
export const InterviewMistakes = ({ mistakes = [], onMistakesChange }) => {
  const [newMistake, setNewMistake] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMistake.trim()) return;

    onMistakesChange([...mistakes, newMistake.trim()]);
    setNewMistake('');
    setIsAdding(false);
  };

  const handleDelete = (index) => {
    const updated = mistakes.filter((_, idx) => idx !== index);
    onMistakesChange(updated);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Mistakes I Made</h3>
          <p className="text-xs text-slate-500 font-medium">Document mistakes to avoid repeating them in future rounds</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="text-sm py-1.5 px-3 flex items-center space-x-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Mistake</span>
          </Button>
        )}
      </div>

      {/* Add Inline Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newMistake}
            onChange={(e) => setNewMistake(e.target.value)}
            placeholder="e.g. Took too long to solve the graph problem."
            required
            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            autoFocus
          />
          <Button type="submit" size="sm">
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setIsAdding(false); setNewMistake(''); }}>
            Cancel
          </Button>
        </form>
      )}

      {/* List */}
      {mistakes.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-150 rounded bg-slate-50/30">
          <span className="text-slate-500 font-medium">No mistakes logged. Excellent round!</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {mistakes.map((mistake, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 rounded border border-slate-100 bg-red-50/10 hover:bg-red-50/20 hover:border-red-100/50 transition-colors"
            >
              <div className="flex items-start space-x-2.5">
                <AlertOctagon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-800 text-sm sm:text-base font-normal leading-relaxed">
                  {mistake}
                </span>
              </div>
              <button
                onClick={() => handleDelete(index)}
                type="button"
                className="p-1 rounded text-slate-400 hover:text-red-655 hover:bg-red-50 shrink-0"
                title="Remove Mistake"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default InterviewMistakes;
