import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Modal form for scheduling a detailed Follow-up with reminder intervals and notes.
 */
export const FollowUpForm = ({ followUp, onClose, onSubmit }) => {
  const isEdit = !!followUp;

  const [date, setDate] = useState('');
  const [reminder, setReminder] = useState('None');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const reminderOptions = ['None', 'On the day', '1 day before', '3 days before', '1 week before'];

  useEffect(() => {
    if (followUp) {
      setDate(followUp.date || '');
      setReminder(followUp.reminder || 'None');
      setNote(followUp.note || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [followUp]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Follow-up date is required.');
      return;
    }

    onSubmit({
      date,
      reminder,
      note: note.trim(),
      completed: followUp ? !!followUp.completed : false
    });
  };

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg animate-fade-in-up space-y-4 text-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h4 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{isEdit ? 'Edit Follow-up' : 'Schedule Follow-up'}</span>
          </h4>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Follow-up Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Reminder</label>
              <select
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {reminderOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Task Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder-slate-400 font-semibold"
              placeholder="e.g. Ask about SDE internship openings..."
            />
          </div>

          {error && <span className="text-xs text-red-500 font-bold block">{error}</span>}

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-lg">
            <Button size="sm" variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Follow-up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FollowUpForm;
