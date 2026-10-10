import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Calendar, Phone, Mail, Award, X, Edit2 } from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from '../applications/ApplicationCard';

/**
 * Interactions logger and timeline history for a specific contact.
 */
export const ContactInteractions = ({
  interactions = [],
  onAddInteraction,
  onEditInteraction,
  onDeleteInteraction
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState('LinkedIn');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const interactionTypes = ['Email', 'LinkedIn', 'Call', 'Message', 'Meeting', 'Other'];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setDate(new Date().toISOString().split('T')[0]);
    setType('LinkedIn');
    setSubject('');
    setNotes('');
    setError('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setDate(item.date || '');
    setType(item.type || 'LinkedIn');
    setSubject(item.subject || '');
    setNotes(item.notes || '');
    setError('');
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Date is required.');
      return;
    }
    if (!notes.trim()) {
      setError('Notes details are required.');
      return;
    }

    const payload = {
      id: editingItem ? editingItem.id : `int-${Math.random().toString(36).substring(2, 9)}`,
      date,
      type,
      subject: subject.trim(),
      notes: notes.trim()
    };

    if (editingItem) {
      onEditInteraction(payload);
    } else {
      onAddInteraction(payload);
    }

    setShowAddModal(false);
  };

  const getTypeIcon = (typeVal) => {
    const map = {
      Call: Phone,
      Email: Mail,
      LinkedIn: MessageSquare,
      Message: MessageSquare,
      Meeting: Calendar
    };
    const Icon = map[typeVal] || Calendar;
    return <Icon className="h-3.5 w-3.5" />;
  };

  const getTypeColor = (typeVal) => {
    return {
      Call: 'bg-blue-50 text-blue-600 border-blue-105',
      Email: 'bg-purple-50 text-purple-600 border-purple-105',
      LinkedIn: 'bg-indigo-50 text-indigo-600 border-indigo-105',
      Message: 'bg-slate-50 text-slate-600 border-slate-105',
      Meeting: 'bg-emerald-50 text-emerald-600 border-emerald-105'
    }[typeVal] || 'bg-slate-50 text-slate-500 border-slate-105';
  };

  // Sort interactions by date descending
  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="space-y-4 text-xs font-semibold">
      {/* Header and Add Button */}
      <div className="flex justify-between items-center border-b border-slate-150 pb-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
          <MessageSquare className="h-4.5 w-4.5 text-slate-400" />
          <span>Communication History</span>
        </h3>
        
        <Button
          onClick={handleOpenAdd}
          className="text-[10px] py-1 px-2.5 flex items-center space-x-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Interaction</span>
        </Button>
      </div>

      {/* Interactions list */}
      <div className="space-y-3">
        {sortedInteractions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
            No interactions logged yet.
          </div>
        ) : (
          sortedInteractions.map((item) => (
            <div
              key={item.id}
              className="relative p-4 rounded-lg border border-slate-200 bg-white shadow-3xs hover:shadow-2xs transition-all space-y-2.5 group"
            >
              {/* Top row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className={`rounded-full p-1.5 border ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-[11px]">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold ml-2">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>

                {/* Hover actions */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-all">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    type="button"
                    className="p-1 rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    title="Edit Note"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteInteraction(item.id)}
                    type="button"
                    className="p-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-550"
                    title="Delete Note"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Subject & Body */}
              <div className="pl-8 font-medium text-slate-655 space-y-1">
                {item.subject && (
                  <h4 className="font-bold text-slate-900 leading-snug">
                    Subject: {item.subject}
                  </h4>
                )}
                <p className="leading-relaxed whitespace-pre-wrap text-[11px] font-sans">
                  {item.notes}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Interaction Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-lg animate-fade-in-up space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900">
                {editingItem ? 'Edit Interaction' : 'Add Interaction'}
              </h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {interactionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Referral request (optional)"
                />
              </div>

              <div>
                <label className="block text-slate-505 font-semibold mb-1">Interaction Notes *</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="4"
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder-slate-400"
                  placeholder="Asked about SDE internship openings..."
                />
              </div>

              {error && <span className="text-[10px] text-red-500 font-bold block">{error}</span>}

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-lg">
                <Button size="sm" variant="outline" onClick={() => setShowAddModal(false)} type="button">
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  {editingItem ? 'Save Notes' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContactInteractions;
