import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { ApplicationFilters } from '../../components/applications/ApplicationFilters';
import { ApplicationList } from '../../components/applications/ApplicationList';
import { ApplicationForm } from '../../components/applications/ApplicationForm';
import { ApplicationDetails } from '../../components/applications/ApplicationDetails';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

export const Applications = () => {
  // 1. Core Applications State
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 2. Filter / Sort Toolbar State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recently-applied');

  // 3. Modals and Triggers State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [detailApp, setDetailApp] = useState(null);

  // 4. Notification Toast State
  const [toast, setToast] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await applicationsApi.getApplications();
      if (res && res.success) {
        setApplications(res.data);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Load from database on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Show toast utility
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // 5. Derived Properties
  // Extract unique locations for the filter list
  const uniqueLocations = Array.from(
    new Set(
      applications
        .map((app) => app.location)
        .filter((loc) => loc && loc.trim() !== '')
    )
  ).sort();

  // 6. CRUD Handlers
  const handleAddApplication = async (newApp) => {
    try {
      const res = await applicationsApi.createApplication(newApp);
      if (res && res.success) {
        setApplications([res.data, ...applications]);
        setShowAddModal(false);
        triggerToast('Application added successfully.');
      } else {
        triggerToast(res.message || 'Failed to add application.', 'error');
      }
    } catch (e) {
      triggerToast(e.message || 'Failed to add application.', 'error');
    }
  };

  const handleUpdateApplication = async (updatedApp) => {
    try {
      const res = await applicationsApi.updateApplication(updatedApp.id, updatedApp);
      if (res && res.success) {
        const updated = applications.map((app) => (app.id === updatedApp.id ? res.data : app));
        setApplications(updated);
        setEditingApp(null);
        // Sync the details view if it's currently open
        if (detailApp && detailApp.id === updatedApp.id) {
          setDetailApp(res.data);
        }
        triggerToast('Application updated successfully.');
      } else {
        triggerToast(res.message || 'Failed to update application.', 'error');
      }
    } catch (e) {
      triggerToast(e.message || 'Failed to update application.', 'error');
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      const res = await applicationsApi.deleteApplication(id);
      if (res && res.success) {
        const updated = applications.filter((app) => app.id !== id);
        setApplications(updated);
        triggerToast('Application deleted.', 'info');
      } else {
        triggerToast(res.message || 'Failed to delete application.', 'error');
      }
    } catch (e) {
      triggerToast(e.message || 'Failed to delete application.', 'error');
    }
  };

  // 7. Filtering & Sorting Logic
  const getFilteredAndSortedApplications = () => {
    let result = [...applications];

    // Filter by search query
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (app) =>
          app.companyName.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query) ||
          (app.location && app.location.toLowerCase().includes(query))
      );
    }

    // Filter by status dropdown
    if (statusFilter !== 'All') {
      result = result.filter((app) => app.status === statusFilter);
    }

    // Filter by location dropdown
    if (locationFilter !== 'All') {
      result = result.filter((app) => app.location === locationFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'recently-applied') {
        return new Date(b.appliedDate) - new Date(a.appliedDate);
      }
      if (sortBy === 'oldest') {
        return new Date(a.appliedDate) - new Date(b.appliedDate);
      }
      if (sortBy === 'company-a-z') {
        return a.companyName.localeCompare(b.companyName);
      }
      if (sortBy === 'company-z-a') {
        return b.companyName.localeCompare(a.companyName);
      }
      return 0;
    });

    return result;
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center bg-white rounded-lg border border-slate-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="mt-3 text-slate-500 font-semibold text-xs">Loading applications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-lg text-xs space-y-4">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-sm font-bold text-slate-800">Unable to load applications</h3>
        <p className="text-slate-400 font-semibold">Please verify your server connection and try again.</p>
        <Button onClick={fetchApplications} size="sm">Retry</Button>
      </div>
    );
  }

  const filteredApps = getFilteredAndSortedApplications();

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Applications
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
            Track and manage every job and internship application in one place.
          </p>
        </div>
        <div className="sm:self-center">
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto text-sm sm:text-base py-2.5 px-4.5 flex items-center justify-center space-x-2 font-medium shadow-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Application</span>
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <ApplicationFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        locations={uniqueLocations}
      />

      {/* Main Table Contents */}
      {applications.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 border-dashed rounded-lg text-xs space-y-4 max-w-sm mx-auto my-6 p-6 shadow-xs">
          <div className="text-4xl">📁</div>
          <h3 className="text-sm font-bold text-slate-805">No applications yet</h3>
          <p className="text-slate-400 font-semibold">Start tracking your job applications in one place.</p>
          <Button onClick={() => setShowAddModal(true)} size="sm">Add Application</Button>
        </div>
      ) : (
        <ApplicationList
          applications={filteredApps}
          onCardClick={setDetailApp}
        />
      )}

      {/* 8. Modal overlays & drawer triggers */}
      {showAddModal && (
        <ApplicationForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddApplication}
        />
      )}

      {editingApp && (
        <ApplicationForm
          application={editingApp}
          onClose={() => setEditingApp(null)}
          onSubmit={handleUpdateApplication}
        />
      )}

      {detailApp && (
        <ApplicationDetails
          application={detailApp}
          onClose={() => setDetailApp(null)}
          onEdit={setEditingApp}
          onDelete={handleDeleteApplication}
        />
      )}

      {/* 9. Success / Info Toast Notifications */}
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
export default Applications;

