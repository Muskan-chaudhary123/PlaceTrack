import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Copy,
  ExternalLink,
  HelpCircle,
  CheckSquare,
  Square,
  Download,
  Eye,
  FileText
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { ResourceForm } from '../../components/resources/ResourceForm';
import { ResourcePreviewModal } from '../../components/resources/ResourcePreviewModal';
import { DeleteResourceModal } from '../../components/resources/DeleteResourceModal';
import { resourcesApi } from '../../api/resources';
import { formatDate } from '../../components/applications/ApplicationCard';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ResourceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const loadResource = async () => {
    setLoading(true);
    try {
      const res = await resourcesApi.getResource(id);
      if (res && res.success && res.data) {
        setResource(res.data);
      } else {
        // Fallback to local storage if API offline
        const saved = JSON.parse(localStorage.getItem('placetrack_resources') || '[]');
        const match = saved.find((r) => r.id === id);
        setResource(match || null);
      }
    } catch (e) {
      try {
        const saved = JSON.parse(localStorage.getItem('placetrack_resources') || '[]');
        const match = saved.find((r) => r.id === id);
        setResource(match || null);
      } catch (err) {
        setResource(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResource();
  }, [id]);

  // Toggle Favorite Action
  const handleToggleFav = async () => {
    if (!resource) return;
    const newFav = !resource.favorite;
    setResource({ ...resource, favorite: newFav });

    try {
      await resourcesApi.updateResource(id, { favorite: newFav });
      triggerToast(newFav ? 'Added to favorites.' : 'Removed from favorites.', 'info');
    } catch (e) {
      triggerToast('Failed to update favorite status.', 'error');
    }
  };

  const handleCopy = () => {
    if (!resource.content) return;
    const textToCopy = resource.type === 'Email Template'
      ? (resource.emailSubject ? `Subject: ${resource.emailSubject}\n\n${resource.content}` : resource.content)
      : resource.content;

    navigator.clipboard.writeText(textToCopy);
    triggerToast(resource.type.includes('Template') ? 'Template copied.' : 'Copied to clipboard.');

    // Increment usage count
    resourcesApi.updateResource(id, { usageCount: (resource.usageCount || 0) + 1 }).catch(() => {});
  };

  const handleToggleCheckItem = async (itemId) => {
    if (!resource.checklistItems) return;
    const updatedItems = resource.checklistItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    setResource({
      ...resource,
      checklistItems: updatedItems,
      updatedAt: new Date().toISOString()
    });

    try {
      await resourcesApi.toggleChecklistItem(id, itemId);
    } catch (e) {}
  };

  const handleOpenLink = () => {
    if (!resource.url) return;
    window.open(resource.url, '_blank', 'noopener,noreferrer');
    resourcesApi.updateResource(id, { usageCount: (resource.usageCount || 0) + 1 }).catch(() => {});
  };

  const handleEditSubmit = async (payload, file, removeFile) => {
    setIsSubmitting(true);
    try {
      const res = await resourcesApi.updateResource(id, payload, file, removeFile);
      if (res && res.success && res.data) {
        setResource(res.data);
        setShowEditModal(false);
        triggerToast('Resource updated successfully.');
        return;
      }
      throw new Error(res?.message || 'Failed to update resource.');
    } catch (e) {
      triggerToast(e.message || 'Failed to update resource.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await resourcesApi.deleteResource(id);
      if (res && res.success) {
        triggerToast('Resource deleted.');
        navigate('/resources', { replace: true });
        return;
      }
      throw new Error(res?.message || 'Failed to delete resource.');
    } catch (e) {
      triggerToast(e.message || 'Failed to delete resource.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!resource.file) return;
    try {
      await resourcesApi.downloadFile(resource.id, resource.file.fileName);
      triggerToast(`Downloading ${resource.file.fileName}...`);
    } catch (err) {
      triggerToast('Failed to download document file.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-lg border border-slate-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-lg text-xs space-y-4 max-w-sm mx-auto my-6 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-800">Resource Not Found</h3>
        <p className="text-slate-400 mt-2">The requested resource does not exist or has been deleted.</p>
        <Link to="/resources" className="inline-block mt-4">
          <Button variant="outline" size="sm">Back to Resources</Button>
        </Link>
      </div>
    );
  }

  const isTemplate = resource.type === 'Email Template' || resource.type === 'Message Template';
  const isLink = resource.type === 'Link';
  const isChecklist = resource.type === 'Checklist';
  const isDoc = resource.type === 'Document';
  const hasFile = isDoc && resource.file && resource.file.fileName;
  const isPdf = hasFile && (resource.file.fileName.toLowerCase().endsWith('.pdf') || resource.file.contentType === 'application/pdf');

  const checklistSummary = (() => {
    if (!isChecklist || !resource.checklistItems || resource.checklistItems.length === 0) return null;
    const completed = resource.checklistItems.filter((i) => i.completed).length;
    const total = resource.checklistItems.length;
    const pct = Math.round((completed / total) * 100) || 0;
    return { completed, total, pct };
  })();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/resources">
            <button type="button" className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {resource.category}
              </span>
              <span className="rounded-md border px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                {resource.type}
              </span>
            </div>
            <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 leading-tight mt-1 truncate max-w-md md:max-w-xl">
              {resource.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm font-medium">
          <button
            onClick={handleToggleFav}
            type="button"
            className="p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors flex items-center justify-center"
            title={resource.favorite ? 'Remove Favorite' : 'Mark Favorite'}
          >
            <Star className={`h-4 w-4 ${resource.favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          </button>

          <Button variant="outline" onClick={() => setShowEditModal(true)} className="flex items-center space-x-1.5 py-2 px-3">
            <Edit className="h-4 w-4 text-slate-500" />
            <span>Edit</span>
          </Button>

          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center space-x-1.5 py-2 px-3 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {/* Main Content (3 columns) */}
        <div className="md:col-span-3 space-y-6 text-xs">
          {resource.description && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 font-medium text-slate-600 leading-relaxed">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">Description</span>
              {resource.description}
            </div>
          )}

          {/* DOCUMENT FILE ATTACHMENT */}
          {hasFile && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{resource.file.fileName}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {formatFileSize(resource.file.fileSize)} • {resource.file.contentType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isPdf && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreviewModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview PDF</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={handleDownloadFile}
                    className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download File</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* LINK RESOURCE */}
          {isLink && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xs text-center space-y-4">
              <div className="rounded-full bg-emerald-50 p-3 w-12 h-12 flex items-center justify-center mx-auto border border-emerald-200">
                <ExternalLink className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">External Resource Link</h4>
                <p className="text-slate-400 font-bold text-[10px] mt-0.5 break-all">{resource.url}</p>
              </div>
              <div className="pt-2">
                <Button onClick={handleOpenLink} className="px-5 shadow-3xs inline-flex items-center space-x-1.5">
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Link</span>
                </Button>
              </div>
            </div>
          )}

          {/* CHECKLIST RESOURCE */}
          {isChecklist && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-5">
              {checklistSummary && (
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex justify-between font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>Task Progress</span>
                    <span className="text-slate-700">{checklistSummary.completed} / {checklistSummary.total} completed ({checklistSummary.pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${checklistSummary.pct}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                {resource.checklistItems && resource.checklistItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleCheckItem(item.id)}
                    className="flex items-center space-x-3 p-3 rounded-md border border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer select-none"
                  >
                    {item.completed ? (
                      <CheckSquare className="h-4.5 w-4.5 text-teal-600 shrink-0" />
                    ) : (
                      <Square className="h-4.5 w-4.5 text-slate-300 shrink-0" />
                    )}
                    <span className={`font-semibold text-slate-700 leading-snug ${item.completed ? 'line-through text-slate-400' : ''}`}>
                      {item.text}
                    </span>
                  </div>
                ))}

                {(!resource.checklistItems || resource.checklistItems.length === 0) && (
                  <div className="text-center py-8 text-slate-400 italic">No items in this checklist.</div>
                )}
              </div>
            </div>
          )}

          {/* CONTENT WORKSPACE (Notes & Templates) */}
          {(resource.content || isTemplate) && (
            <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="flex justify-between items-center bg-slate-50 border-b border-slate-100 px-5 py-3 text-xs font-bold text-slate-400 uppercase">
                <span>{isTemplate ? 'Template Body' : 'Notes Content'}</span>
                
                <button
                  onClick={handleCopy}
                  type="button"
                  className="flex items-center space-x-1 font-bold text-primary hover:text-primary-dark transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>{isTemplate ? 'Copy Template' : 'Copy'}</span>
                </button>
              </div>

              {resource.type === 'Email Template' && resource.emailSubject && (
                <div className="border-b border-slate-100 px-5 py-3 bg-slate-50/50 text-xs font-semibold text-slate-800">
                  <span className="text-slate-400 font-normal">Subject: </span>
                  {resource.emailSubject}
                </div>
              )}

              <div className="p-5 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text bg-white">
                {resource.content || <span className="italic text-slate-400 font-sans font-normal">Content is empty.</span>}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Properties (1 column) */}
        <div className="md:col-span-1 space-y-6 text-xs font-semibold text-slate-600">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Properties
            </h3>

            <div className="space-y-3 font-medium text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Type</span>
                <span className="text-slate-900 font-bold">{resource.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="text-slate-900 font-bold truncate max-w-[120px]">{resource.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Usage Count</span>
                <span className="text-slate-700">{resource.usageCount || 0} times</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created</span>
                <span className="text-slate-700">{formatDate(resource.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Updated</span>
                <span className="text-slate-700">{formatDate(resource.updatedAt || resource.createdAt)}</span>
              </div>
            </div>

            {resource.tags && resource.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 font-semibold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <ResourceForm
          resource={resource}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* PDF Preview Modal */}
      {showPreviewModal && resource.file && (
        <ResourcePreviewModal
          resource={resource}
          onClose={() => setShowPreviewModal(false)}
          onDownload={handleDownloadFile}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteResourceModal
          resource={resource}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}

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

export default ResourceDetailsPage;
