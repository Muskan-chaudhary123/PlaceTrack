import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Form modal to add or edit interviews, linking them to existing applications.
 */
export const InterviewForm = ({ interview, applications = [], onClose, onSubmit }) => {
  const isEdit = !!interview;

  const [selectedAppId, setSelectedAppId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [round, setRound] = useState('Technical Round 1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState('Online');
  const [meetingLink, setMeetingLink] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Scheduled');
  const [result, setResult] = useState('Pending');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState({});

  const rounds = [
    'HR', 'OA', 'Technical Round 1', 'Technical Round 2', 'Technical Round 3',
    'Managerial', 'System Design', 'Final', 'Other'
  ];

  const types = ['Online', 'Offline', 'Phone', 'Video Call'];
  const statuses = ['Scheduled', 'Rescheduled', 'Cancelled', 'Completed', 'Pending'];
  const results = ['Pending', 'Selected', 'Rejected', 'On Hold'];

  useEffect(() => {
    if (interview) {
      setSelectedAppId(interview.applicationId || '');
      setCompanyName(interview.companyName || '');
      setRole(interview.role || '');
      setRound(interview.round || 'Technical Round 1');
      setDate(interview.date || '');
      setTime(interview.time || '');
      setDuration(interview.duration || 60);
      setType(interview.type || 'Online');
      setMeetingLink(interview.meetingLink || '');
      setLocation(interview.location || '');
      setStatus(interview.status || 'Scheduled');
      setResult(interview.result || 'Pending');
      setNotes(interview.notes || '');
    }
  }, [interview]);

  // Handle Application Selection
  const handleAppChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    
    if (appId) {
      const app = applications.find((a) => a.id === appId);
      if (app) {
        setCompanyName(app.companyName);
        setRole(app.role);
        setErrors((prev) => ({ ...prev, companyName: '', role: '' }));
      }
    } else {
      setCompanyName('');
      setRole('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required.';
    }
    if (!role.trim()) {
      newErrors.role = 'Role title is required.';
    }
    if (!date) {
      newErrors.date = 'Date is required.';
    }
    if (!time) {
      newErrors.time = 'Time is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: isEdit ? interview.id : `int-${Math.random().toString(36).substring(2, 9)}`,
      applicationId: selectedAppId,
      companyName: companyName.trim(),
      role: role.trim(),
      round,
      date,
      time,
      duration: parseInt(duration, 10) || 60,
      type,
      meetingLink: type !== 'Offline' ? meetingLink.trim() : '',
      location: type === 'Offline' ? location.trim() : '',
      status,
      result,
      notes: notes.trim(),
      // Carry forward existing structures if editing
      questions: isEdit ? (interview.questions || []) : [],
      mistakes: isEdit ? (interview.mistakes || []) : [],
      learnings: isEdit ? (interview.learnings || []) : [],
      improvementAreas: isEdit ? (interview.improvementAreas || []) : [],
      ratings: isEdit ? (interview.ratings || { dsa: 0, csFundamentals: 0, communication: 0, problemSolving: 0, confidence: 0 }) : { dsa: 0, csFundamentals: 0, communication: 0, problemSolving: 0, confidence: 0 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up dark:bg-slate-800 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 px-6 py-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Interview' : 'Add Interview'}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-4 space-y-4 text-sm">
            {/* Related Application Picker */}
            {!isEdit && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Connect to Application
                </label>
                <select
                  value={selectedAppId}
                  onChange={handleAppChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="">Custom Company / Application Not Listed</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.companyName} — {app.role} ({app.status})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Company & Role */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={!!selectedAppId}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:text-slate-500 ${
                    errors.companyName ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="e.g. Amazon"
                />
                {errors.companyName && <span className="text-[10px] text-red-500 mt-1 block">{errors.companyName}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={!!selectedAppId}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 disabled:bg-slate-50 disabled:text-slate-500 ${
                    errors.role ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="e.g. SDE"
                />
                {errors.role && <span className="text-[10px] text-red-500 mt-1 block">{errors.role}</span>}
              </div>
            </div>

            {/* Round & Duration */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Round</label>
                <select
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {rounds.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="5"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 ${
                    errors.date ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                />
                {errors.date && <span className="text-[10px] text-red-500 mt-1 block">{errors.date}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 ${
                    errors.time ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                />
                {errors.time && <span className="text-[10px] text-red-500 mt-1 block">{errors.time}</span>}
              </div>
            </div>

            {/* Type & Links / Locations */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {type === 'Offline' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location Address</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g. Building 10, DLF CyberCity"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Meeting Link</label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    placeholder="e.g. https://meet.google.com/..."
                  />
                </div>
              )}
            </div>

            {/* Status & Result */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Result</label>
                <select
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {results.map((res) => (
                    <option key={res} value={res}>{res}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* General Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">General Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                placeholder="Topic coverage details, contact numbers, dressing codes..."
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-lg">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Save Changes' : 'Add Interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InterviewForm;
