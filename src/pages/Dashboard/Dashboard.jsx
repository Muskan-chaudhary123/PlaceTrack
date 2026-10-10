import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Calendar, Trophy, CheckSquare } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { applicationsApi } from '../../api/applications';
import { questionsApi } from '../../api/questions';
import { ApplicationForm } from '../../components/applications/ApplicationForm';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/dashboard/StatCard';
import { ApplicationOverview } from '../../components/dashboard/ApplicationOverview';
import { UpcomingInterviews } from '../../components/dashboard/UpcomingInterviews';
import { RecentApplications } from '../../components/dashboard/RecentApplications';
import { TodaysTasks } from '../../components/dashboard/TodaysTasks';
import { InterviewPreparation } from '../../components/dashboard/InterviewPreparation';

export const Dashboard = () => {
  const { user } = useAuth();
  const calendarKey = user?.id ? `placetrack_calendar_events_${user.id}` : 'placetrack_calendar_events';
  const interviewsKey = user?.id ? `placetrack_interviews_${user.id}` : 'placetrack_interviews';

  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadDashboardData = async () => {
    // 1. Applications
    try {
      const res = await applicationsApi.getApplications();
      if (res && res.success && Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch (e) {
      setApplications([]);
    }

    // 2. Interviews
    try {
      const savedInts = localStorage.getItem(interviewsKey) || (!user?.id ? localStorage.getItem('placetrack_interviews') : null);
      if (savedInts) {
        const parsed = JSON.parse(savedInts);
        setInterviews(Array.isArray(parsed) ? parsed.filter((i) => !i.isDemo && !String(i.id || '').startsWith('demo-')) : []);
      } else {
        setInterviews([]);
      }
    } catch (e) {
      setInterviews([]);
    }

    // 3. Questions
    try {
      const qRes = await questionsApi.getQuestions();
      if (qRes && qRes.success && Array.isArray(qRes.data)) {
        setQuestions(qRes.data);
      } else {
        setQuestions([]);
      }
    } catch (e) {
      setQuestions([]);
    }

    // 4. Calendar Events & Tasks
    try {
      const savedEvts = localStorage.getItem(calendarKey) || (!user?.id ? localStorage.getItem('placetrack_calendar_events') : null);
      if (savedEvts) {
        const parsed = JSON.parse(savedEvts);
        setCalendarEvents(
          Array.isArray(parsed)
            ? parsed.filter(
                (e) =>
                  !e.isDemo &&
                  !String(e.id || '').startsWith('evt-') &&
                  !String(e.id || '').startsWith('demo-') &&
                  !(e.date && e.date.startsWith('2026-08') && String(e.id || '').startsWith('evt-'))
              )
            : []
        );
      } else {
        setCalendarEvents([]);
      }
    } catch (e) {
      setCalendarEvents([]);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [calendarKey, interviewsKey, user?.id]);

  // Handle Application Creation
  const handleAddApplication = async (data) => {
    try {
      const res = await applicationsApi.createApplication(data);
      if (res && res.success) {
        loadDashboardData();
        setShowAddModal(false);
        return;
      }
    } catch (e) {
      console.warn("API createApplication fallback to local state:", e);
    }

    // Fallback: save to local state and localStorage if API is unreachable
    const newApp = {
      ...data,
      id: `app-${Date.now()}`
    };
    const updated = [newApp, ...applications];
    setApplications(updated);
    try {
      localStorage.setItem('placetrack_applications', JSON.stringify(updated));
    } catch (err) {}
    setShowAddModal(false);
  };

  // Toggle Task Completion
  const handleToggleTask = (taskId) => {
    const updated = calendarEvents.map((evt) => {
      if (evt.id === taskId) {
        const isComp = evt.status === 'completed';
        return {
          ...evt,
          status: isComp ? 'upcoming' : 'completed'
        };
      }
      return evt;
    });

    setCalendarEvents(updated);
    try {
      localStorage.setItem(calendarKey, JSON.stringify(updated));
      localStorage.setItem('placetrack_calendar_events', JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save updated events:", err);
    }
  };

  // Quick Add Task
  const handleAddTask = (taskTitle) => {
    const today = new Date().toISOString().split('T')[0];
    const newEvt = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      type: 'Task',
      date: today,
      startTime: '09:00',
      endTime: '10:00',
      allDay: true,
      priority: 'Medium',
      status: 'upcoming',
      reminder: 'None',
      description: taskTitle,
      createdAt: new Date().toISOString()
    };

    const updated = [newEvt, ...calendarEvents];
    setCalendarEvents(updated);
    try {
      localStorage.setItem(calendarKey, JSON.stringify(updated));
      localStorage.setItem('placetrack_calendar_events', JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save new task:", err);
    }
  };

  // Derived Metric Calculations
  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'OA' || a.status === 'Screening' || a.status === 'Interview'
  ).length;

  const totalInterviews = interviews.length;
  const upcomingInterviewsCount = interviews.filter(
    (i) => i.status === 'Scheduled' || i.status === 'Rescheduled' || i.status === 'Pending'
  ).length;

  const totalOffers = applications.filter(
    (a) => a.status === 'Selected' || a.status === 'Offer' || a.status === 'Accepted'
  ).length;
  const offerConversionPct = totalApplications > 0
    ? Math.round((totalOffers / totalApplications) * 100)
    : 0;

  // Filter tasks: any item where status is upcoming, or specifically type Task/Revision
  const pendingTasks = calendarEvents.filter(
    (evt) => evt.status !== 'completed' && evt.status !== 'cancelled'
  );
  const completedTasks = calendarEvents.filter((evt) => evt.status === 'completed');

  return (
    <div className="space-y-7 sm:space-y-9 pb-12 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            {getGreeting()}, {user?.fullName || 'Student'}
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Here's what's happening with your placement journey.
          </p>
        </div>
        <div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm sm:text-base py-2.5 px-4.5 font-medium shadow-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Application</span>
          </Button>
        </div>
      </div>

      {/* 2. Summary Section: 4 Compact Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <StatCard
          label="Applications"
          value={totalApplications}
          subtext={
            totalApplications > 0
              ? `${activeApplications} active in pipeline`
              : '0 active in pipeline'
          }
          icon={Briefcase}
          iconBg="bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-400"
        />

        <StatCard
          label="Interviews"
          value={totalInterviews}
          subtext={
            upcomingInterviewsCount > 0
              ? `${upcomingInterviewsCount} upcoming`
              : '0 upcoming'
          }
          icon={Calendar}
          iconBg="bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400"
        />

        <StatCard
          label="Offers"
          value={totalOffers}
          subtext={
            totalOffers > 0
              ? `${offerConversionPct}% conversion rate`
              : 'Awaiting offers'
          }
          icon={Trophy}
          iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
        />

        <StatCard
          label="Pending Tasks"
          value={pendingTasks.length}
          subtext={
            pendingTasks.length > 0
              ? `${completedTasks.length} completed`
              : '0 pending tasks'
          }
          icon={CheckSquare}
          iconBg="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
        />
      </div>

      {/* 3 & 4. Two-Column Section: Application Overview & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <ApplicationOverview
            applications={applications}
            onAddClick={() => setShowAddModal(true)}
          />
        </div>
        <div className="lg:col-span-5">
          <UpcomingInterviews interviews={interviews} />
        </div>
      </div>

      {/* 5 & 6. Two-Column Section: Recent Applications & Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <RecentApplications
            applications={applications}
            onAddClick={() => setShowAddModal(true)}
          />
        </div>
        <div className="lg:col-span-5">
          <TodaysTasks
            tasks={calendarEvents}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        </div>
      </div>

      {/* 7. Interview Preparation */}
      <div>
        <InterviewPreparation questions={questions} />
      </div>

      {/* Add Application Modal Popup */}
      {showAddModal && (
        <ApplicationForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddApplication}
        />
      )}
    </div>
  );
};

export default Dashboard;
