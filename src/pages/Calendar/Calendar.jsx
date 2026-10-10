import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { applicationsApi } from '../../api/applications';
import { questionsApi } from '../../api/questions';
import { CalendarToolbar } from '../../components/calendar/CalendarToolbar';
import { CalendarFilters } from '../../components/calendar/CalendarFilters';
import { CalendarView } from '../../components/calendar/CalendarView';
import { EventForm } from '../../components/calendar/EventForm';
import { EventDetails } from '../../components/calendar/EventDetails';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

export const Calendar = () => {
  const { user } = useAuth();
  const calendarKey = user?.id ? `placetrack_calendar_events_${user.id}` : 'placetrack_calendar_events';
  const interviewsKey = user?.id ? `placetrack_interviews_${user.id}` : 'placetrack_interviews';
  const contactsKey = user?.id ? `placetrack_contacts_${user.id}` : 'placetrack_contacts';

  // Date and View Toggles
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  // Master Databases loaded from localStorage
  const [customEvents, setCustomEvents] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [contacts, setContacts] = useState([]);

  // Search/Filters Toolbar
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawer State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toast, setToast] = useState(null);

  const sanitizeEvents = (evts) => {
    if (!Array.isArray(evts)) return [];
    return evts.filter((e) => {
      if (!e) return false;
      if (e.isDemo) return false;
      const idStr = String(e.id || '');
      if (idStr.startsWith('evt-') || idStr.startsWith('demo-')) return false;
      if (e.date && e.date.startsWith('2026-08') && (idStr.startsWith('evt-') || idStr.startsWith('event-'))) return false;
      return true;
    });
  };

  // Load datasets on mount
  useEffect(() => {
    // 1. Custom calendar events
    let initialEvents = [];
    const savedEvts = localStorage.getItem(calendarKey) || (!user?.id ? localStorage.getItem('placetrack_calendar_events') : null);
    if (savedEvts) {
      try {
        initialEvents = sanitizeEvents(JSON.parse(savedEvts));
      } catch (err) {
        initialEvents = [];
      }
    }
    setCustomEvents(initialEvents);

    // 2. Interviews
    let initialInts = [];
    const savedInts = localStorage.getItem(interviewsKey) || (!user?.id ? localStorage.getItem('placetrack_interviews') : null);
    if (savedInts) {
      try {
        const parsed = JSON.parse(savedInts);
        if (Array.isArray(parsed)) {
          initialInts = parsed.filter((i) => !i.isDemo && !String(i.id || '').startsWith('demo-'));
        }
      } catch (err) {
        initialInts = [];
      }
    }
    setInterviews(initialInts);

    // 3. Applications
    const loadApps = async () => {
      try {
        const res = await applicationsApi.getApplications();
        if (res && res.success && Array.isArray(res.data)) {
          setApplications(res.data);
          return;
        }
      } catch (e) {}
      setApplications([]);
    };
    loadApps();

    // 4. Questions
    const loadQuestions = async () => {
      try {
        const res = await questionsApi.getQuestions();
        if (res && res.success && Array.isArray(res.data)) {
          setQuestions(res.data);
          return;
        }
      } catch (e) {}
      setQuestions([]);
    };
    loadQuestions();

    // 5. Contacts
    let initialCons = [];
    const savedCons = localStorage.getItem(contactsKey) || (!user?.id ? localStorage.getItem('placetrack_contacts') : null);
    if (savedCons) {
      try {
        const parsed = JSON.parse(savedCons);
        if (Array.isArray(parsed)) {
          initialCons = parsed.filter((c) => !c.isDemo && !String(c.id || '').startsWith('con-'));
        }
      } catch (err) {
        initialCons = [];
      }
    }
    setContacts(initialCons);
  }, [calendarKey, interviewsKey, contactsKey, user?.id]);

  // Save Helpers
  const saveCustomEvents = (updated) => {
    setCustomEvents(updated);
    localStorage.setItem(calendarKey, JSON.stringify(updated));
    localStorage.setItem('placetrack_calendar_events', JSON.stringify(updated));
  };

  const saveInterviews = (updated) => {
    setInterviews(updated);
    localStorage.setItem(interviewsKey, JSON.stringify(updated));
    localStorage.setItem('placetrack_interviews', JSON.stringify(updated));
  };

  const saveApplications = (updated) => {
    setApplications(updated);
    localStorage.setItem('placetrack_applications', JSON.stringify(updated));
  };

  const saveQuestions = (updated) => {
    setQuestions(updated);
    localStorage.setItem('placetrack_questions', JSON.stringify(updated));
  };

  const saveContacts = (updated) => {
    setContacts(updated);
    localStorage.setItem(contactsKey, JSON.stringify(updated));
    localStorage.setItem('placetrack_contacts', JSON.stringify(updated));
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Time addition helper
  const addMinutes = (timeStr, mins) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const dateObj = new Date();
    dateObj.setHours(h, m + mins);
    const outH = dateObj.getHours().toString().padStart(2, '0');
    const outM = dateObj.getMinutes().toString().padStart(2, '0');
    return `${outH}:${outM}`;
  };

  // DYNAMIC MERGE: Custom Events + Derived Interviews + Derived Application Deadlines
  const getMergedEvents = () => {
    const list = [...customEvents];

    // Derived Interview Events
    interviews.forEach((i) => {
      list.push({
        id: `derived-int-${i.id}`,
        title: `${i.companyName} ${i.round}`,
        type: 'Interview',
        date: i.date,
        startTime: i.time || '10:00',
        endTime: i.time ? addMinutes(i.time, i.duration || 60) : '11:00',
        allDay: false,
        companyName: i.companyName,
        applicationId: i.applicationId,
        interviewId: i.id,
        priority: 'High',
        status: i.status === 'Completed' ? 'completed' : 'upcoming',
        reminder: '1 day before',
        description: i.notes || `${i.round} scheduled.`
      });
    });

    // Derived Application Deadline Events
    applications.forEach((app) => {
      if (app.deadline && app.deadline.trim() !== '') {
        list.push({
          id: `derived-app-dl-${app.id}`,
          title: `${app.companyName} Application Deadline`,
          type: 'Application Deadline',
          date: app.deadline,
          startTime: '23:59',
          endTime: '',
          allDay: false,
          companyName: app.companyName,
          applicationId: app.id,
          priority: 'High',
          status: 'upcoming',
          reminder: '1 day before',
          description: `Deadline to apply for ${app.role} at ${app.companyName}.`
        });
      }
    });

    // Derived Question Revision & Revisit Events
    questions.forEach((q) => {
      if (q.nextRevision && q.nextRevision.trim() !== '') {
        list.push({
          id: `derived-q-rev-${q.id}`,
          title: `${q.question.slice(0, 25)}... (Revision)`,
          type: 'Revision',
          date: q.nextRevision,
          startTime: '08:00',
          endTime: '09:00',
          allDay: false,
          companyName: q.companyIds?.[0] || '',
          applicationId: q.applicationId || '',
          priority: q.difficulty || 'Medium',
          status: q.revisionStatus === 'Revised' ? 'completed' : 'upcoming',
          reminder: '1 day before',
          description: `Revision due for question: "${q.question}"\nTopic: ${q.topic || 'None'}\nNote: ${q.quickNote || 'None'}`
        });
      }

      if (q.revisitDate && q.revisitDate.trim() !== '') {
        list.push({
          id: `derived-q-revisit-${q.id}`,
          title: `${q.question.slice(0, 25)}... (Revisit)`,
          type: 'Revision',
          date: q.revisitDate,
          startTime: '10:00',
          endTime: '11:00',
          allDay: false,
          companyName: q.companyIds?.[0] || '',
          applicationId: q.applicationId || '',
          priority: q.difficulty || 'Medium',
          status: q.revisionStatus === 'Revised' ? 'completed' : 'upcoming',
          reminder: '1 day before',
          description: `Revisit scheduled for question: "${q.question}"\nTopic: ${q.topic || 'None'}\nNote: ${q.quickNote || 'None'}`
        });
      }
    });

    // Derived Contact Follow-up Events
    contacts.forEach((c) => {
      const fu = c.followUp;
      const date = c.followUpDate || (fu && !fu.completed ? fu.date : '');
      if (date && date.trim() !== '') {
        list.push({
          id: `derived-contact-fu-${c.id}`,
          title: `Follow-up: ${c.name} (${c.company})`,
          type: 'Follow-up',
          date: date,
          startTime: '11:00',
          endTime: '12:00',
          allDay: false,
          companyName: c.company,
          priority: fu?.priority || 'Medium',
          status: fu?.completed ? 'completed' : 'upcoming',
          reminder: fu?.reminder || 'None',
          description: fu?.note || `Follow up with ${c.name} at ${c.company}.`
        });
      }
    });

    return list;
  };

  const allMergedEvents = getMergedEvents();

  // CRUD Actions Routing to Respective Databases
  const handleAddEvent = (newEvt) => {
    const updated = [newEvt, ...customEvents];
    saveCustomEvents(updated);
    setShowAddModal(false);
    triggerToast('Event added successfully.');
  };

  const handleUpdateEvent = (updatedEvt) => {
    const isDerived = updatedEvt.id.startsWith('derived-');
    
    if (!isDerived) {
      // 1. Update custom events
      const updated = customEvents.map((e) => (e.id === updatedEvt.id ? updatedEvt : e));
      saveCustomEvents(updated);
    } else if (updatedEvt.id.startsWith('derived-int-')) {
      // 2. Update derived interview date/time
      const intId = updatedEvt.interviewId;
      const targetInt = interviews.find((i) => i.id === intId);
      if (targetInt) {
        const updatedInt = {
          ...targetInt,
          date: updatedEvt.date,
          time: updatedEvt.startTime,
          notes: updatedEvt.description
        };
        const updatedList = interviews.map((i) => (i.id === intId ? updatedInt : i));
        saveInterviews(updatedList);
        
        // Sync open details view if edit occurred from calendar details page
        if (selectedEvent && selectedEvent.id === updatedEvt.id) {
          setSelectedEvent(updatedEvt);
        }
      }
    } else if (updatedEvt.id.startsWith('derived-app-dl-')) {
      // 3. Update derived application deadline
      const appId = updatedEvt.applicationId;
      const targetApp = applications.find((a) => a.id === appId);
      if (targetApp) {
        const updatedApp = {
          ...targetApp,
          deadline: updatedEvt.date
        };
        const updatedList = applications.map((a) => (a.id === appId ? updatedApp : a));
        saveApplications(updatedList);
        
        if (selectedEvent && selectedEvent.id === updatedEvt.id) {
          setSelectedEvent(updatedEvt);
        }
      }
    } else if (updatedEvt.id.startsWith('derived-q-rev-') || updatedEvt.id.startsWith('derived-q-revisit-')) {
      const qId = updatedEvt.id.startsWith('derived-q-rev-')
        ? updatedEvt.id.replace('derived-q-rev-', '')
        : updatedEvt.id.replace('derived-q-revisit-', '');
      const targetQ = questions.find((q) => q.id === qId);
      if (targetQ) {
        const updatedQ = {
          ...targetQ,
          nextRevision: updatedEvt.id.startsWith('derived-q-rev-') ? updatedEvt.date : targetQ.nextRevision,
          revisitDate: updatedEvt.id.startsWith('derived-q-revisit-') ? updatedEvt.date : targetQ.revisitDate,
          updatedAt: new Date().toISOString()
        };
        const updatedList = questions.map((q) => (q.id === qId ? updatedQ : q));
        saveQuestions(updatedList);
        
        if (selectedEvent && selectedEvent.id === updatedEvt.id) {
          setSelectedEvent(updatedEvt);
        }
      }
    } else if (updatedEvt.id.startsWith('derived-contact-fu-')) {
      const cId = updatedEvt.id.replace('derived-contact-fu-', '');
      const targetC = contacts.find((c) => c.id === cId);
      if (targetC) {
        const nextFu = targetC.followUp ? { ...targetC.followUp, date: updatedEvt.date } : { date: updatedEvt.date, reminder: 'None', note: '', completed: false };
        const updatedC = {
          ...targetC,
          followUp: nextFu,
          followUpDate: updatedEvt.date,
          updatedAt: new Date().toISOString()
        };
        const updatedList = contacts.map((c) => (c.id === cId ? updatedC : c));
        saveContacts(updatedList);

        if (selectedEvent && selectedEvent.id === updatedEvt.id) {
          setSelectedEvent(updatedEvt);
        }
      }
    }

    setEditingEvent(null);
    triggerToast('Event updated successfully.');
  };

  const handleDeleteEvent = (id) => {
    const isDerived = id.startsWith('derived-');

    if (!isDerived) {
      const updated = customEvents.filter((e) => e.id !== id);
      saveCustomEvents(updated);
    } else if (id.startsWith('derived-int-')) {
      const intId = id.replace('derived-int-', '');
      const updated = interviews.filter((i) => i.id !== intId);
      saveInterviews(updated);
    } else if (id.startsWith('derived-app-dl-')) {
      const appId = id.replace('derived-app-dl-', '');
      const updated = applications.map((app) =>
        app.id === appId ? { ...app, deadline: '' } : app
      );
      saveApplications(updated);
    } else if (id.startsWith('derived-q-rev-')) {
      const qId = id.replace('derived-q-rev-', '');
      const updated = questions.map((q) => q.id === qId ? { ...q, nextRevision: '' } : q);
      saveQuestions(updated);
    } else if (id.startsWith('derived-q-revisit-')) {
      const qId = id.replace('derived-q-revisit-', '');
      const updated = questions.map((q) => q.id === qId ? { ...q, revisitDate: '' } : q);
      saveQuestions(updated);
    } else if (id.startsWith('derived-contact-fu-')) {
      const cId = id.replace('derived-contact-fu-', '');
      const updated = contacts.map((c) => c.id === cId ? { ...c, followUp: null, followUpDate: '', updatedAt: new Date().toISOString() } : c);
      saveContacts(updated);
    }

    triggerToast('Event deleted.', 'info');
  };

  const handleCompleteEvent = (id) => {
    const isDerived = id.startsWith('derived-');

    if (!isDerived) {
      const updated = customEvents.map((e) =>
        e.id === id ? { ...e, status: 'completed' } : e
      );
      saveCustomEvents(updated);
    } else if (id.startsWith('derived-int-')) {
      const intId = id.replace('derived-int-', '');
      const targetInt = interviews.find((i) => i.id === intId);
      if (targetInt) {
        const updatedInt = { ...targetInt, status: 'Completed' };
        const updatedList = interviews.map((i) => (i.id === intId ? updatedInt : i));
        saveInterviews(updatedList);
      }
    } else if (id.startsWith('derived-q-rev-') || id.startsWith('derived-q-revisit-')) {
      const qId = id.startsWith('derived-q-rev-')
        ? id.replace('derived-q-rev-', '')
        : id.replace('derived-q-revisit-', '');
      const targetQ = questions.find((q) => q.id === qId);
      if (targetQ) {
        const updatedQ = {
          ...targetQ,
          revisionStatus: 'Revised',
          lastRevised: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        };
        const updatedList = questions.map((q) => (q.id === qId ? updatedQ : q));
        saveQuestions(updatedList);
      }
    } else if (id.startsWith('derived-contact-fu-')) {
      const cId = id.replace('derived-contact-fu-', '');
      const targetC = contacts.find((c) => c.id === cId);
      if (targetC) {
        const nextFu = targetC.followUp ? { ...targetC.followUp, completed: true } : { date: '', reminder: 'None', note: '', completed: true };
        const updatedC = {
          ...targetC,
          followUp: nextFu,
          followUpDate: '',
          updatedAt: new Date().toISOString()
        };
        const updatedList = contacts.map((c) => (c.id === cId ? updatedC : c));
        saveContacts(updatedList);
      }
    }

    triggerToast('Event marked completed.');
  };

  // Navigations Handler
  const handleNavigate = (direction) => {
    const multiplier = direction === 'next' ? 1 : -1;
    const newDate = new Date(currentDate);

    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + multiplier);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + multiplier * 7);
    } else if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + multiplier);
    }

    setCurrentDate(newDate);
  };

  // Filters & Search Logic
  const getFilteredEvents = () => {
    let result = [...allMergedEvents];

    // Filter by search query
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          (e.companyName && e.companyName.toLowerCase().includes(query)) ||
          (e.description && e.description.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (typeFilter !== 'All') {
      result = result.filter((e) => e.type === typeFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'All') {
      result = result.filter((e) => e.priority === priorityFilter);
    }

    // Filter by completion status
    if (statusFilter !== 'All') {
      result = result.filter((e) => e.status === statusFilter);
    }

    return result;
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Career Calendar
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
            Keep track of interviews, deadlines, assessments, and important placement tasks.
          </p>
        </div>
        <div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto text-sm sm:text-base py-2.5 px-4.5 flex items-center justify-center space-x-2 font-medium shadow-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Event</span>
          </Button>
        </div>
      </div>

      {/* Navigation Toolbar */}
      <CalendarToolbar
        currentDate={currentDate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigate={handleNavigate}
        onTodayClick={() => setCurrentDate(new Date())}
      />

      {/* Filter toolbar */}
      <CalendarFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Main Full Width Calendar Board */}
      <div className="w-full">
        <CalendarView
          currentDate={currentDate}
          viewMode={viewMode}
          events={filteredEvents}
          onEventClick={setSelectedEvent}
          onDayClick={(day) => {
            setCurrentDate(day);
            setViewMode('day');
          }}
        />
      </div>

      {/* Modals & Slide-out drawer overlays */}
      {showAddModal && (
        <EventForm
          applications={applications}
          interviews={interviews}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddEvent}
        />
      )}

      {editingEvent && (
        <EventForm
          event={editingEvent}
          applications={applications}
          interviews={interviews}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleUpdateEvent}
        />
      )}

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={setEditingEvent}
          onDelete={handleDeleteEvent}
          onComplete={handleCompleteEvent}
        />
      )}

      {/* Alert toast message */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
export default Calendar;
