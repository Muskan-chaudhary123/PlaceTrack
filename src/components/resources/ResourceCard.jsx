import React, { useState } from 'react';
import {
  FileText,
  StickyNote,
  Mail,
  MessageSquare,
  Link2,
  CheckSquare,
  ExternalLink,
  Download,
  Eye,
  Copy,
  Check,
  Edit,
  Trash2,
  Star,
  File
} from 'lucide-react';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const formatSimpleDate = (dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const ResourceCard = ({
  resource,
  onOpen,
  onEdit,
  onDelete,
  onToggleFav,
  onPreviewFile,
  onDownloadFile,
  onToggleCheckItem,
  onCopyContent
}) => {
  const [copied, setCopied] = useState(false);
  const r = resource;

  const handleCopy = (e) => {
    e.stopPropagation();
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

  // Type styling & icons
  const typeConfig = {
    Document: {
      icon: FileText,
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    Note: {
      icon: StickyNote,
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      iconBg: 'bg-slate-100 text-slate-600'
    },
    'Email Template': {
      icon: Mail,
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-50 text-sky-600'
    },
    'Message Template': {
      icon: MessageSquare,
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-50 text-purple-600'
    },
    Link: {
      icon: Link2,
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    Checklist: {
      icon: CheckSquare,
      badge: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-50 text-teal-600'
    }
  }[r.type] || {
    icon: File,
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600'
  };

  const TypeIcon = typeConfig.icon;

  // Checklist calculations
  const isChecklist = r.type === 'Checklist';
  const checklistItems = r.checklistItems || [];
  const completedCount = checklistItems.filter((item) => item.completed).length;
  const totalCount = checklistItems.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Document file details
  const isDoc = r.type === 'Document';
  const hasFile = isDoc && r.file && r.file.fileName;
  const isPdf = hasFile && (r.file.fileName.toLowerCase().endsWith('.pdf') || r.file.contentType === 'application/pdf');

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4.5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="space-y-3">
        {/* Header: Icon, Category & Type Badge, Favorite */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${typeConfig.iconBg}`}>
              <TypeIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                {r.category}
              </span>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeConfig.badge}`}>
                {r.type}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(r.id);
            }}
            type="button"
            className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
            title={r.favorite ? 'Remove from favorites' : 'Mark as favorite'}
          >
            <Star className={`h-4.5 w-4.5 ${r.favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onOpen(r)}
          className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {r.title}
        </h3>

        {/* Subject line for Email Templates */}
        {r.type === 'Email Template' && r.emailSubject && (
          <p className="text-xs font-semibold text-slate-700 line-clamp-1 bg-slate-50 border border-slate-100 rounded px-2 py-1">
            <span className="text-slate-400 font-normal">Subject: </span>
            {r.emailSubject}
          </p>
        )}

        {/* Description or Content snippet */}
        {r.description ? (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {r.description}
          </p>
        ) : r.content ? (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-mono text-[11px] bg-slate-50/60 p-1.5 rounded border border-slate-100">
            {r.content}
          </p>
        ) : null}

        {/* Document File Attachment Indicator */}
        {hasFile && (
          <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 text-xs">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <FileText className="h-4 w-4 text-blue-600 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-800 block truncate" title={r.file.fileName}>
                  {r.file.fileName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {formatFileSize(r.file.fileSize)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {isPdf && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewFile(r);
                  }}
                  type="button"
                  className="p-1 text-slate-500 hover:text-primary hover:bg-white rounded transition-colors"
                  title="Preview PDF"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadFile(r);
                }}
                type="button"
                className="p-1 text-slate-500 hover:text-primary hover:bg-white rounded transition-colors"
                title="Download original file"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Checklist Progress and Top Items */}
        {isChecklist && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{completedCount} of {totalCount} completed</span>
              <span className="text-teal-600 font-bold">{completionPct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            {checklistItems.length > 0 && (
              <div className="space-y-1 pt-1">
                {checklistItems.slice(0, 2).map((item) => (
                  <label
                    key={item.id}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={!!item.completed}
                      onChange={() => onToggleCheckItem(r.id, item.id)}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className={`truncate text-xs ${item.completed ? 'line-through text-slate-400' : ''}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
                {checklistItems.length > 2 && (
                  <span className="text-[11px] text-slate-400 pl-1 block">
                    +{checklistItems.length - 2} more items...
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Link Resource URL */}
        {r.type === 'Link' && r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark truncate pt-1 hover:underline"
            title={r.url}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{r.url.replace(/^https?:\/\//, '')}</span>
          </a>
        )}
      </div>

      {/* Card Footer: Metadata date + Type-specific actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-medium">
          {r.updatedAt ? `Updated ${formatSimpleDate(r.updatedAt)}` : formatSimpleDate(r.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          {/* Action: Copy for Templates */}
          {(r.type === 'Email Template' || r.type === 'Message Template') && (
            <button
              onClick={handleCopy}
              type="button"
              className="flex items-center gap-1 px-2 py-1 rounded text-slate-600 hover:text-primary hover:bg-slate-50 font-medium transition-colors text-xs"
              title="Copy template content to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-semibold text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Copy</span>
                </>
              )}
            </button>
          )}

          {/* Action: External Link open */}
          {r.type === 'Link' && r.url && (
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded transition-colors"
              title="Open link"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {/* Action: Edit */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(r);
            }}
            type="button"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded transition-colors"
            title="Edit resource"
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Action: Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(r);
            }}
            type="button"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete resource"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
