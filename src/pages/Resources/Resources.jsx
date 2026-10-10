import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Files, FolderOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { resourcesApi } from '../../api/resources';
import { ResourceCategories, RESOURCE_CATEGORIES } from '../../components/resources/ResourceCategories';
import { ResourceFilters } from '../../components/resources/ResourceFilters';
import { ResourceCard } from '../../components/resources/ResourceCard';
import { ResourceForm } from '../../components/resources/ResourceForm';
import { ResourcePreviewModal } from '../../components/resources/ResourcePreviewModal';
import { ResourceViewModal } from '../../components/resources/ResourceViewModal';
import { DeleteResourceModal } from '../../components/resources/DeleteResourceModal';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

export const Resources = () => {
  const { user } = useAuth();

  // Core Data State
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search Toolbar State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [favFilter, setFavFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Updated');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [viewingResource, setViewingResource] = useState(null);
  const [previewFileResource, setPreviewFileResource] = useState(null);
  const [deletingResource, setDeletingResource] = useState(null);

  // Action Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch resources from backend API
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const res = await resourcesApi.getResources();
      if (res && res.success && Array.isArray(res.data)) {
        setResources(res.data);
      } else {
        setResources([]);
      }
    } catch (err) {
      console.warn('API getResources error:', err);
      // Fallback to local storage if API temporarily offline
      try {
        const userKey = user?.id ? `placetrack_resources_${user.id}` : 'placetrack_resources';
        const saved = localStorage.getItem(userKey);
        setResources(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setResources([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Synchronize with local storage as secondary backup
  const syncLocalStorage = (updatedList) => {
    try {
      const userKey = user?.id ? `placetrack_resources_${user.id}` : 'placetrack_resources';
      localStorage.setItem(userKey, JSON.stringify(updatedList));
      localStorage.setItem('placetrack_resources', JSON.stringify(updatedList));
    } catch (e) {}
  };

  // Create Resource Handler
  const handleCreateResource = async (payload, file) => {
    setIsSubmitting(true);
    try {
      const res = await resourcesApi.createResource(payload, file);
      if (res && res.success && res.data) {
        const updated = [res.data, ...resources];
        setResources(updated);
        syncLocalStorage(updated);
        setShowAddModal(false);
        triggerToast('Resource created successfully.');
        return;
      }
      throw new Error(res?.message || 'Failed to create resource.');
    } catch (err) {
      triggerToast(err.message || 'Failed to create resource.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Resource Handler
  const handleUpdateResource = async (payload, file, removeFile) => {
    setIsSubmitting(true);
    try {
      const res = await resourcesApi.updateResource(payload.id, payload, file, removeFile);
      if (res && res.success && res.data) {
        const updated = resources.map((r) => (r.id === payload.id ? res.data : r));
        setResources(updated);
        syncLocalStorage(updated);
        setEditingResource(null);
        if (viewingResource && viewingResource.id === payload.id) {
          setViewingResource(res.data);
        }
        triggerToast('Resource updated successfully.');
        return;
      }
      throw new Error(res?.message || 'Failed to update resource.');
    } catch (err) {
      triggerToast(err.message || 'Failed to update resource.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Resource Handler
  const handleConfirmDelete = async () => {
    if (!deletingResource) return;
    setIsDeleting(true);
    try {
      const res = await resourcesApi.deleteResource(deletingResource.id);
      if (res && res.success) {
        const updated = resources.filter((r) => r.id !== deletingResource.id);
        setResources(updated);
        syncLocalStorage(updated);
        setDeletingResource(null);
        if (viewingResource && viewingResource.id === deletingResource.id) {
          setViewingResource(null);
        }
        triggerToast('Resource deleted.');
        return;
      }
      throw new Error(res?.message || 'Failed to delete resource.');
    } catch (err) {
      triggerToast(err.message || 'Failed to delete resource.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Favorite
  const handleToggleFav = async (id) => {
    const target = resources.find((r) => r.id === id);
    if (!target) return;

    const newFav = !target.favorite;
    // Optimistic UI update
    const updated = resources.map((r) =>
      r.id === id ? { ...r, favorite: newFav, updatedAt: new Date().toISOString() } : r
    );
    setResources(updated);
    syncLocalStorage(updated);

    try {
      await resourcesApi.updateResource(id, { favorite: newFav });
      triggerToast(newFav ? 'Added to favorites.' : 'Removed from favorites.', 'info');
    } catch (err) {
      // Revert if failed
      fetchResources();
    }
  };

  // Toggle Checklist Item
  const handleToggleCheckItem = async (resourceId, itemId) => {
    // Optimistic update
    const updated = resources.map((r) => {
      if (r.id === resourceId && r.checklistItems) {
        const items = r.checklistItems.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );
        return { ...r, checklistItems: items, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    setResources(updated);
    syncLocalStorage(updated);

    if (viewingResource && viewingResource.id === resourceId) {
      const target = updated.find((r) => r.id === resourceId);
      if (target) setViewingResource(target);
    }

    try {
      await resourcesApi.toggleChecklistItem(resourceId, itemId);
    } catch (err) {
      fetchResources();
    }
  };

  // Download File Handler
  const handleDownloadFile = async (r) => {
    if (!r.file) return;
    try {
      await resourcesApi.downloadFile(r.id, r.file.fileName);
      triggerToast(`Downloading ${r.file.fileName}...`);
    } catch (err) {
      triggerToast('Failed to download document file.', 'error');
    }
  };

  // Copy Content Handler
  const handleCopyContent = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      triggerToast('Copied to clipboard.');
    }
  };

  // Reset Filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setTypeFilter('All');
    setFavFilter('All');
    setSortBy('Recently Updated');
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedCategory !== 'All' ||
    typeFilter !== 'All' ||
    favFilter !== 'All' ||
    sortBy !== 'Recently Updated';

  // Compute Category Counts for Filter Chips
  const categoryCounts = RESOURCE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = resources.filter((r) => r.category === cat).length;
    return acc;
  }, {});
  categoryCounts['All'] = resources.length;

  // Client-side Filter & Sort
  const filteredResources = (() => {
    let result = [...resources];

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // 2. Type Filter
    if (typeFilter !== 'All') {
      result = result.filter((r) => r.type === typeFilter);
    }

    // 3. Favorites Filter
    if (favFilter === 'Favorites Only') {
      result = result.filter((r) => r.favorite);
    }

    // 4. Search Filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.category && r.category.toLowerCase().includes(q)) ||
          (r.content && r.content.toLowerCase().includes(q)) ||
          (r.emailSubject && r.emailSubject.toLowerCase().includes(q)) ||
          (r.url && r.url.toLowerCase().includes(q)) ||
          (r.file && r.file.fileName && r.file.fileName.toLowerCase().includes(q)) ||
          (r.tags && r.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // 5. Sorting
    result.sort((a, b) => {
      if (sortBy === 'Recently Created') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (sortBy === 'Title A-Z') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (sortBy === 'Title Z-A') {
        return (b.title || '').localeCompare(a.title || '');
      }
      if (sortBy === 'Most Used') {
        return (b.usageCount || 0) - (a.usageCount || 0);
      }
      // Default: Recently Updated
      return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
    });

    return result;
  })();

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 leading-tight">
            Resources
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1 font-normal">
            Your personal library for placement preparation and career growth.
          </p>
        </div>
        <div className="sm:self-center">
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto text-sm sm:text-base py-2.5 px-4.5 flex items-center justify-center space-x-2 font-medium shadow-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Resource</span>
          </Button>
        </div>
      </div>

      {/* 2. Compact Category Navigation Chips */}
      <ResourceCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categoryCounts={categoryCounts}
      />

      {/* 3. Filter & Search Toolbar */}
      <ResourceFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        favFilter={favFilter}
        onFavFilterChange={setFavFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Resources Grid or Empty State */}
      <div className="w-full">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="mt-3 text-slate-500 font-semibold text-xs">Loading career library...</span>
          </div>
        ) : resources.length === 0 ? (
          /* Zero-state for new users */
          <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-200 rounded-xl max-w-lg mx-auto shadow-2xs">
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-primary mb-3">
              <Files className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No resources yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Upload your first document, save a useful link, or create a note to build your personal career library.
            </p>
            <div className="mt-5">
              <Button
                onClick={() => setShowAddModal(true)}
                className="text-xs sm:text-sm py-2 px-4 inline-flex items-center space-x-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Add Resource</span>
              </Button>
            </div>
          </div>
        ) : filteredResources.length === 0 ? (
          /* Filter zero-state */
          <div className="text-center py-16 px-4 bg-white border border-dashed border-slate-200 rounded-xl shadow-2xs space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <FolderOpen className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">
              {favFilter === 'Favorites Only' && resources.filter((r) => r.favorite).length === 0
                ? "No favorite resources yet"
                : selectedCategory !== 'All'
                ? `No resources in "${selectedCategory}"`
                : typeFilter !== 'All'
                ? `No "${typeFilter}" resources found`
                : 'No resources found matching your search'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search criteria, selecting another category, or resetting all filters.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          /* Responsive 2-to-3 column grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onOpen={(r) => setViewingResource(r)}
                onEdit={(r) => setEditingResource(r)}
                onDelete={(r) => setDeletingResource(r)}
                onToggleFav={handleToggleFav}
                onPreviewFile={(r) => setPreviewFileResource(r)}
                onDownloadFile={handleDownloadFile}
                onToggleCheckItem={handleToggleCheckItem}
                onCopyContent={handleCopyContent}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Modals */}
      {/* Add Resource Modal */}
      {showAddModal && (
        <ResourceForm
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateResource}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Resource Modal */}
      {editingResource && (
        <ResourceForm
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSubmit={handleUpdateResource}
          isSubmitting={isSubmitting}
        />
      )}

      {/* View Resource Modal */}
      {viewingResource && (
        <ResourceViewModal
          resource={viewingResource}
          onClose={() => setViewingResource(null)}
          onEdit={(r) => {
            setViewingResource(null);
            setEditingResource(r);
          }}
          onDelete={(r) => {
            setViewingResource(null);
            setDeletingResource(r);
          }}
          onToggleFav={handleToggleFav}
          onPreviewFile={(r) => setPreviewFileResource(r)}
          onDownloadFile={handleDownloadFile}
          onToggleCheckItem={handleToggleCheckItem}
          onCopyContent={handleCopyContent}
        />
      )}

      {/* Document / PDF Preview Modal */}
      {previewFileResource && (
        <ResourcePreviewModal
          resource={previewFileResource}
          onClose={() => setPreviewFileResource(null)}
          onDownload={handleDownloadFile}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingResource && (
        <DeleteResourceModal
          resource={deletingResource}
          onClose={() => setDeletingResource(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {/* Toast Alert */}
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

export default Resources;
