import React, { useState } from 'react';
import { X, ExternalLink, Calendar, MapPin, Hash, Users, Award, Tag, DollarSign, FileText } from 'lucide-react';
import { Button } from '../common/Button';
import { formatDate } from './ApplicationCard';

/**
 * Slide-out right drawer displaying comprehensive application specifications and action controls.
 */
export const ApplicationDetails = ({ application, onClose, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!application) return null;

  const statusBadgeClass = {
    Applied: 'bg-slate-100 text-slate-700 border-slate-200',
    OA: 'bg-purple-50 text-purple-700 border-purple-200',
    Interview: 'bg-blue-50 text-primary border-blue-200',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }[application.status] || 'bg-slate-100 text-slate-700 border-slate-200';

  const detailsList = [
    { label: 'Status', value: application.status, icon: Tag, isBadge: true },
    { label: 'Location', value: application.location, icon: MapPin },
    { label: 'Applied Date', value: formatDate(application.appliedDate), icon: Calendar },
    { label: 'Deadline', value: formatDate(application.deadline) || 'None', icon: Calendar },
    { label: 'Job ID / Code', value: application.jobId, icon: Hash },
    { label: 'Source', value: application.source, icon: FileText },
    { label: 'Recruiter Contact', value: application.recruiter, icon: Users },
    { label: 'Has Referral?', value: application.referral, icon: Award },
    { label: 'Salary / Stipend', value: application.salary, icon: DollarSign },
  ];

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = () => {
    onDelete(application.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      {/* Drawer Container */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Application Details
            </span>
            <h3 className="text-xl font-bold text-slate-950 truncate mt-0.5 max-w-[280px]">
              {application.companyName}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
          {/* Main Title & Role */}
          <div>
            <h4 className="text-base font-semibold text-slate-800 leading-snug">
              {application.role}
            </h4>
          </div>

          {/* Details Specifications Grid */}
          <div className="space-y-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
            {detailsList.map((detail, idx) => {
              if (detail.value === undefined || detail.value === '') return null;
              
              return (
                <div key={idx} className="flex items-start space-x-3">
                  <div className="mt-0.5 rounded text-slate-400">
                    <detail.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {detail.label}
                    </span>
                    {detail.isBadge ? (
                      <span className={`inline-flex rounded border px-2 py-0.5 font-semibold text-xs uppercase tracking-wider mt-1 ${statusBadgeClass}`}>
                        {detail.value}
                      </span>
                    ) : (
                      <span className="block text-slate-800 text-sm sm:text-base font-medium mt-0.5 truncate">
                        {detail.value}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Job Link Action */}
          {application.jobLink && (
            <div>
              <a
                href={application.jobLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 font-semibold text-sm sm:text-base text-primary hover:text-primary-dark transition-colors"
              >
                <ExternalLink className="h-4.5 w-4.5" />
                <span>Open Job Posting</span>
              </a>
            </div>
          )}

          {/* Notes Card */}
          <div>
            <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">
              Revision Notes
            </h4>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-slate-700 text-sm leading-relaxed font-normal whitespace-pre-wrap">
              {application.notes || (
                <span className="italic text-slate-400">No notes written for this application. Click Edit to add summaries.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
          <Button variant="danger" onClick={handleDeleteClick}>
            Delete
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => { onEdit(application); onClose(); }}>
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div onClick={handleCancelDelete} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-sm">
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Delete Application?
            </h4>
            <p className="text-slate-600 mb-6 font-normal">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" className="bg-red-600 hover:bg-red-700 text-white border-transparent" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ApplicationDetails;
