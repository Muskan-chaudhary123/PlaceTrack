import React, { useState } from 'react';
import { Plus, X, Trash2, ShieldAlert, CheckSquare } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Improvement tracker logging subjects that need review, prioritizing them, and updating their status.
 */
export const ImprovementAreas = ({ areas = [], onAreasChange }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('DSA');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Not Started');

  const categories = [
    'DSA', 'DBMS', 'OS', 'OOP', 'Computer Networks', 'System Design',
    'Python', 'JavaScript', 'Django', 'SQL', 'HR', 'Behavioral', 'Other'
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const newArea = {
      id: `imp-${Math.random().toString(36).substring(2, 9)}`,
      topic: topic.trim(),
      category,
      priority,
      status
    };

    onAreasChange([...areas, newArea]);
    setTopic('');
    setCategory('DSA');
    setPriority('Medium');
    setStatus('Not Started');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    const updated = areas.filter((area) => area.id !== id);
    onAreasChange(updated);
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = areas.map((area) =>
      area.id === id ? { ...area, status: newStatus } : area
    );
    onAreasChange(updated);
  };

  const handlePriorityChange = (id, newPriority) => {
    const updated = areas.map((area) =>
      area.id === id ? { ...area, priority: newPriority } : area
    );
    onAreasChange(updated);
  };

  const priorityColors = {
    Low: 'bg-slate-50 text-slate-600 border-slate-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-250',
    High: 'bg-red-50 text-red-750 border-red-200 font-semibold'
  };

  const statusColors = {
    'Not Started': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-blue-50 text-primary',
    Revised: 'bg-emerald-50 text-emerald-700 font-semibold border-emerald-200'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Areas to Improve</h3>
          <p className="text-xs text-slate-500 font-medium">Map out specific topics requiring review prior to next interviews</p>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="text-sm py-1.5 px-3 flex items-center space-x-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Add Topic</span>
          </Button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="space-y-3 rounded-lg border border-slate-150 p-4 bg-slate-50/50">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Topic Name</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Graph Algorithms / DFS"
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-950 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-950 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-950 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Revised">Revised</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => { setIsAdding(false); setTopic(''); }}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Topic
            </Button>
          </div>
        </form>
      )}

      {/* List / Table */}
      {areas.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-150 rounded bg-slate-50/30">
          <span className="text-slate-500 font-medium">No revision topics logged yet.</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase font-semibold">
                <th className="py-2.5">Topic</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Priority</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {areas.map((area) => (
                <tr key={area.id} className="hover:bg-slate-50/20 font-medium text-slate-700">
                  <td className="py-3 font-semibold text-slate-900 text-sm sm:text-base">{area.topic}</td>
                  <td className="py-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">
                      {area.category}
                    </span>
                  </td>
                  <td className="py-3">
                    <select
                      value={area.priority}
                      onChange={(e) => handlePriorityChange(area.id, e.target.value)}
                      className={`rounded px-2 py-0.5 text-xs uppercase font-semibold focus:outline-none border ${priorityColors[area.priority]}`}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <select
                      value={area.status}
                      onChange={(e) => handleStatusChange(area.id, e.target.value)}
                      className={`rounded px-2 py-0.5 text-xs uppercase font-semibold focus:outline-none ${statusColors[area.status]}`}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Revised">Revised</option>
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(area.id)}
                      type="button"
                      className="p-1 rounded text-slate-400 hover:text-red-655 hover:bg-red-50"
                      title="Remove Topic"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default ImprovementAreas;
