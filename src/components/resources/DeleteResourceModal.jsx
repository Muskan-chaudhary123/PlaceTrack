import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

export const DeleteResourceModal = ({ resource, onClose, onConfirm, isDeleting = false }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs" />

      <div className="relative z-10 w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl animate-fade-in-up space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Resource</h3>
            <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
          Are you sure you want to delete <span className="font-bold text-slate-900">"{resource.title}"</span>?
          {resource.file && ' The attached document file will also be permanently deleted.'}
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResourceModal;

