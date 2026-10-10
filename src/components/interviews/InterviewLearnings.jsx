import React, { useState } from 'react';
import { Plus, X, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Learnings tracker listing lessons learned and new study materials gained.
 */
export const InterviewLearnings = ({ learnings = [], onLearningsChange }) => {
  const [newLearning, setNewLearning] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLearning.trim()) return;

    onLearningsChange([...learnings, newLearning.trim()]);
    setNewLearning('');
    setIsAdding(false);
  };

  const handleDelete = (index) => {
    const updated = learnings.filter((_, idx) => idx !== index);
    onLearningsChange(updated);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">What I Learned</h3>
          <p className="text-xs text-slate-500 font-medium">Document study takeaways, core standards, and interview notes</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="text-sm py-1.5 px-3 flex items-center space-x-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Learning</span>
          </Button>
        )}
      </div>

      {/* Add Inline Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newLearning}
            onChange={(e) => setNewLearning(e.target.value)}
            placeholder="e.g. Revise DBMS indexing structures."
            required
            className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            autoFocus
          />
          <Button type="submit" size="sm">
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setIsAdding(false); setNewLearning(''); }}>
            Cancel
          </Button>
        </form>
      )}

      {/* List */}
      {learnings.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-150 rounded bg-slate-50/30">
          <span className="text-slate-400">No learning points logged yet.</span>
        </div>
      ) : (
        <ul className="space-y-2">
          {learnings.map((learning, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 rounded border border-slate-100 bg-emerald-50/10 hover:bg-emerald-50/20 hover:border-emerald-100/50 transition-colors"
            >
              <div className="flex items-start space-x-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-800 text-sm sm:text-base font-normal leading-relaxed">
                  {learning}
                </span>
              </div>
              <button
                onClick={() => handleDelete(index)}
                type="button"
                className="p-1 rounded text-slate-400 hover:text-red-655 hover:bg-red-50 shrink-0"
                title="Remove Learning"
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
export default InterviewLearnings;
