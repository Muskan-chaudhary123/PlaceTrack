import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { InterviewFilters } from '../../components/interviews/InterviewFilters';
import { InterviewCard } from '../../components/interviews/InterviewCard';
import { InterviewForm } from '../../components/interviews/InterviewForm';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

export const Interviews = () => {
  const { user } = useAuth();
  const interviewsKey = user?.id ? `placetrack_interviews_${user.id}` : 'placetrack_interviews';
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);

  // Tabs: 'upcoming' or 'history'
  const [activeTab, setActiveTab] = useState('upcoming');

  // Filters state
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('All');
  const [roundFilter, setRoundFilter] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load interviews
    let loadedInts = [];
    const savedInts = localStorage.getItem(interviewsKey) || (!user?.id ? localStorage.getItem('placetrack_interviews') : null);
    if (savedInts) {
      try {
        const parsed = JSON.parse(savedInts);
        if (Array.isArray(parsed)) {
          loadedInts = parsed.filter((i) => !i.isDemo && !String(i.id || '').startsWith('demo-'));
        }
      } catch (e) {
        loadedInts = [];
      }
    }
    setInterviews(loadedInts);

    // Load applications for linking in dropdown
    const savedApps = localStorage.getItem('placetrack_applications');
    if (savedApps) {
      try {
        setApplications(JSON.parse(savedApps));
      } catch (e) {}
    }
  }, [interviewsKey, user?.id]);

  const saveInterviews = (updated) => {
    setInterviews(updated);
    localStorage.setItem(interviewsKey, JSON.stringify(updated));
    localStorage.setItem('placetrack_interviews', JSON.stringify(updated));
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAddInterview = (newInt) => {
    const updated = [newInt, ...interviews];
    saveInterviews(updated);
    setShowAddModal(false);
    triggerToast('Interview added successfully.');
  };

  // Filter & Sort Logic
  const getFilteredAndSorted = () => {
    let result = [...interviews];

    // 1. Tab separation
    if (activeTab === 'upcoming') {
      result = result.filter(
        (i) => i.status === 'Scheduled' || i.status === 'Rescheduled' || i.status === 'Pending'
      );
    } else {
      result = result.filter((i) => i.status === 'Completed' || i.status === 'Cancelled');
    }

    // 2. Search query (company or role)
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.companyName.toLowerCase().includes(query) || i.role.toLowerCase().includes(query)
      );
    }

    // 3. Result filter
    if (resultFilter !== 'All') {
      result = result.filter((i) => i.result === resultFilter);
    }

    // 4. Round filter
    if (roundFilter !== 'All') {
      result = result.filter((i) => {
        if (roundFilter === 'Technical') {
          return i.round.toLowerCase().includes('technical') || i.round === 'Technical';
        }
        return i.round === roundFilter;
      });
    }

    // 5. Sorting
    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);

      if (sortBy === 'upcoming') {
        // Sort closest future date first
        return dateA - dateB;
      }
      if (sortBy === 'most-recent') {
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return 0;
    });

    return result;
  };

  const filteredInterviews = getFilteredAndSorted();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Interview Hub
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
            Prepare for interviews, record your experiences, and learn from every round.
          </p>
        </div>
        <div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto text-sm sm:text-base py-2.5 px-4.5 flex items-center justify-center space-x-2 font-medium shadow-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Interview</span>
          </Button>
        </div>
      </div>

      {/* Primary Tab Bar View selection */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-6 -mb-px">
          <button
            onClick={() => { setActiveTab('upcoming'); setSortBy('upcoming'); }}
            type="button"
            className={`pb-3.5 text-sm sm:text-[15px] font-semibold border-b-2 px-1 transition-all ${
              activeTab === 'upcoming'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            Upcoming Scheduled
          </button>
          <button
            onClick={() => { setActiveTab('history'); setSortBy('most-recent'); }}
            type="button"
            className={`pb-3.5 text-sm sm:text-[15px] font-semibold border-b-2 px-1 transition-all ${
              activeTab === 'history'
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-300 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            Interview History
          </button>
        </nav>
      </div>

      {/* Filters bar */}
      <InterviewFilters
        search={search}
        onSearchChange={setSearch}
        resultFilter={resultFilter}
        onResultFilterChange={setResultFilter}
        roundFilter={roundFilter}
        onRoundFilterChange={setRoundFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Card Grid list */}
      {interviews.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No upcoming interviews
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Keep track of upcoming rounds, interviewer feedback, and your preparation progress.
          </p>
          <div className="mt-4.5">
            <Button
              onClick={() => setShowAddModal(true)}
              className="text-sm py-2 px-4 inline-flex items-center space-x-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Schedule Interview</span>
            </Button>
          </div>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-slate-400 font-medium">
            No interviews found matching your criteria.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              isHistory={activeTab === 'history'}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <InterviewForm
          applications={applications}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddInterview}
        />
      )}

      {/* Toast popup */}
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
export default Interviews;
