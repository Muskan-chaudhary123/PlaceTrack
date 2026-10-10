import React, { useState } from 'react';
import {
  X,
  Edit,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Download,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  Link2,
  CheckSquare,
  StickyNote,
  Star,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '../common/Button';

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ResourceViewModal = ({
  resource,
  onClose,
  onEdit,
  onDelete,
  onToggleFav,
  onPreviewFile,
  onDownloadFile,
  onToggleCheckItem,
  onCopyContent
}) => {
  const [copied, setCopied] = useState(false);
  if (!resource) return null;
  const r = resource;

  const handleCopy = () => {
    const textToCopy = r.type === 'Email Template'
      ? (r.emailSubject ? `Subject: ${r.emailSubject}\n\n${r.content}` : r.content)
      : r.content;

    if (onCopyContent) {
      onCopyContent(textToCopy);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDoc = r.type === 'Document';
  const isTemplate = r.type === 'Email Template' || r.type === 'Message Template';
  const isChecklist = r.type === 'Checklist';
  const checklistItems = r.checklistItems || [];
  const completedCount = checklistItems.filter((i) => i.completed).length;
  const isPdf = isDoc && r.file?.fileName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs" />

      <div className="relative z-10 w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl animate-fade-in-up my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {r.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {r.type}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {r.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleFav(r.id)}
              className="p-1.5 text-slate-300 hover:text-amber-400 rounded-lg hover:bg-white transition-colors"
              title={r.favorite ? 'Favorited' : 'Add to favorites'}
            >
              <Star className={`h-5 w-5 ${r.favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-[calc(85vh-140px)] overflow-y-auto px-6 py-5 space-y-4 text-xs">
          {/* Description */}
          {r.description && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Description
              </span>
              <p className="text-slate-700 leading-relaxed text-xs">
                {r.description}
              </p>
            </div>
          )}

          {/* Email Subject */}
          {r.type === 'Email Template' && r.emailSubject && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Subject Line
              </span>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 font-semibold text-slate-800 text-xs">
                {r.emailSubject}
              </div>
            </div>
          )}

          {/* Document File Card */}
          {isDoc && r.file && (
            <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-slate-900 block truncate text-xs">
                    {r.file.fileName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {formatFileSize(r.file.fileSize)} • {r.file.contentType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isPdf && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewFile(r)}
                    className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => onDownloadFile(r)}
                  className="inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          )}

          {/* Note or Template Body */}
          {r.content && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isTemplate ? 'Template Content' : 'Notes'}
                </span>
                {isTemplate && (
                  <button
                    onClick={handleCopy}
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {r.content}
              </div>
            </div>
          )}

          {/* Link URL */}
          {r.type === 'Link' && r.url && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Resource Link
              </span>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-primary font-semibold text-xs transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="break-all">{r.url}</span>
              </a>
            </div>
          )}

          {/* Checklist Tasks */}
          {isChecklist && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Checklist Tasks ({completedCount}/{checklistItems.length})</span>
                <span className="text-teal-600">
                  {checklistItems.length > 0 ? Math.round((completedCount / checklistItems.length) * 100) : 0}% Done
                </span>
              </div>
              <div className="space-y-1.5 border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
                {checklistItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 p-1.5 rounded hover:bg-white transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={!!item.completed}
                      onChange={() => onToggleCheckItem(r.id, item.id)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4 cursor-pointer"
                    />
                    <span className={`text-xs font-medium text-slate-800 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {r.tags && r.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {r.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 rounded-b-xl">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onDelete(r);
            }}
            className="text-red-600 hover:bg-red-50 hover:border-red-200 inline-flex items-center gap-1.5 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onEdit(r);
              }}
              className="inline-flex items-center gap-1.5 text-xs"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Resource</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceViewModal;

