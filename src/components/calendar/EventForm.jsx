import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';


export const EventForm = ({ event, applications = [], interviews = [], onClose, onSubmit }) => {
  const isEdit = !!event;

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Task');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [allDay, setAllDay] = useState(false);
  
  const [selectedAppId, setSelectedAppId] = useState('');
  const [selectedIntId, setSelectedIntId] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [priority, setPriority] = useState('Medium');
  const [reminder, setReminder] = useState('1 day before');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const types = ['Interview', 'OA / Assessment', 'Application Deadline', 'Follow-up', 'Revision', 'Task', 'Other'];
  const priorities = ['Low', 'Medium', 'High'];
  const reminders = ['None', '10 minutes before', '30 minutes before', '1 hour before', '1 day before'];

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setType(event.type || 'Task');
      setDate(event.date || '');
      setStartTime(event.startTime || '09:00');
      setEndTime(event.endTime || '10:00');
      setAllDay(!!event.allDay);
      setSelectedAppId(event.applicationId || '');
      setSelectedIntId(event.interviewId || '');
      setCompanyName(event.companyName || '');
      setPriority(event.priority || 'Medium');
      setReminder(event.reminder || '1 day before');
      setDescription(event.description || '');
    }
  }, [event]);

  const handleAppChange = (e) => {
    const appId = e.target.value;
    setSelectedAppId(appId);
    if (appId) {
      const app = applications.find((a) => a.id === appId);
      if (app) {
        setCompanyName(app.companyName);
        if (title === '' || title === `${companyName} application deadline`) {
          setTitle(`${app.companyName} Application Deadline`);
          setType('Application Deadline');
        }
      }
    } else {
      setCompanyName('');
    }
  };

  const handleIntChange = (e) => {
    const intId = e.target.value;
    setSelectedIntId(intId);
    if (intId) {
      const int = interviews.find((i) => i.id === intId);
      if (int) {
        setCompanyName(int.companyName);
        setSelectedAppId(int.applicationId || '');
        setTitle(`${int.companyName} - ${int.round}`);
        setType('Interview');
        setDate(int.date);
        setStartTime(int.time || '09:00');
      }
    } else {
      setCompanyName('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Event title is required.';
    }
    if (!date) {
      newErrors.date = 'Date is required.';
    }
    if (!allDay) {
      if (!startTime) newErrors.startTime = 'Start time is required.';
      if (!endTime) newErrors.endTime = 'End time is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: isEdit ? event.id : `evt-${Math.random().toString(36).substring(2, 9)}`,
      title: title.trim(),
      type,
      date,
      startTime: allDay ? '' : startTime,
      endTime: allDay ? '' : endTime,
      allDay,
      companyName: companyName.trim(),
      applicationId: selectedAppId,
      interviewId: selectedIntId,
      priority,
      status: isEdit ? (event.status || 'upcoming') : 'upcoming',
      reminder,
      description: description.trim(),
      createdAt: isEdit ? event.createdAt : new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up dark:bg-slate-800 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 px-6 py-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Event' : 'Add Event'}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-4 space-y-4 text-sm">
            

            {!isEdit && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Application</label>
                  <select
                    value={selectedAppId}
                    onChange={handleAppChange}
                    disabled={!!selectedIntId}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">None / Custom Event</option>
                    {applications.map((app) => (
                      <option key={app.id} value={app.id}>
                        {app.companyName} — {app.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Interview</label>
                  <select
                    value={selectedIntId}
                    onChange={handleIntChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  >
                    <option value="">None / Custom Event</option>
                    {interviews.map((int) => (
                      <option key={int.id} value={int.id}>
                        {int.companyName} — {int.round} ({int.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.title ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                }`}
                placeholder="e.g. DBMS Revision, Technical Panel Interview"
              />
              {errors.title && <span className="text-[10px] text-red-500 mt-1 block">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {types.map((ty) => (
                    <option key={ty} value={ty}>{ty}</option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="flex items-center">
              <input
                id="allDay"
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="allDay" className="ml-2 font-semibold text-slate-700 select-none">
                All Day Event
              </label>
            </div>

            {!allDay && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reminder</label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-950 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  {reminders.map((rem) => (
                    <option key={rem} value={rem}>{rem}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                placeholder="Topic outlines, interview checklists, link credentials..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-lg">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Save Changes' : 'Add Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EventForm;
