import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  Mail,
  MessageSquare,
  Link2,
  CheckSquare,
  StickyNote,
  AlertCircle,
  File,
  Check
} from 'lucide-react';
import { Button } from '../common/Button';
import { RESOURCE_CATEGORIES } from './ResourceCategories';
import { RESOURCE_TYPES } from './ResourceFilters';

const CATEGORY_DEFAULT_TYPES = {
  'Email Templates': 'Email Template',
  'Referral Templates': 'Message Template',
  'Recruiter Messages': 'Message Template',
  'Resume': 'Document',
  'CS Fundamentals': 'Document',
  'Interview Preparation': 'Checklist',
  'Project Notes': 'Note',
  'Study Notes': 'Document',
  'Useful Links': 'Link',
  'Personal': 'Note'
};

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt', '.pptx', '.ppt'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ResourceForm = ({ resource, onClose, onSubmit, isSubmitting = false }) => {
  const isEdit = !!resource;
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Resume');
  const [type, setType] = useState('Document');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [favorite, setFavorite] = useState(false);

  // File states (for Document type)
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [removeFile, setRemoveFile] = useState(false);
  const [fileDragOver, setFileDragOver] = useState(false);

  // Checklist states
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resource) {
      setTitle(resource.title || '');
      setCategory(resource.category || 'Resume');
      setType(resource.type || 'Document');
      setDescription(resource.description || '');
      setContent(resource.content || '');
      setEmailSubject(resource.emailSubject || '');
      setUrl(resource.url || '');
      setTagsInput(resource.tags ? resource.tags.join(', ') : '');
      setFavorite(!!resource.favorite);
      setChecklistItems(resource.checklistItems ? [...resource.checklistItems] : []);
      setExistingFile(resource.file || null);
    } else {
      // Default on new create
      setCategory('Resume');
      setType('Document');
    }
  }, [resource]);

  // Handle Category Change: Suggest sensible default Type
  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (!isEdit && CATEGORY_DEFAULT_TYPES[newCat]) {
      setType(CATEGORY_DEFAULT_TYPES[newCat]);
      setErrors({});
    }
  };

  // Checklist items
  const handleAddChecklistItem = (e) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: newItemText.trim(),
      completed: false
    };

    setChecklistItems([...checklistItems, newItem]);
    setNewItemText('');
  };

  const handleRemoveChecklistItem = (itemId) => {
    setChecklistItems(checklistItems.filter((i) => i.id !== itemId));
  };

  // File selection handling
  const handleFileSelect = (file) => {
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrors((prev) => ({
        ...prev,
        file: `Invalid format. Supported formats: ${ALLOWED_EXTENSIONS.join(', ')}`
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        file: `File size exceeds 25MB limit (${formatFileSize(file.size)}).`
      }));
      return;
    }

    setSelectedFile(file);
    setRemoveFile(false);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.file;
      return copy;
    });

    // Auto-fill title if title is empty
    if (!title.trim()) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setTitle(nameWithoutExt);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setFileDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Placeholder insertion for Email & Message templates
  const insertPlaceholder = (ph) => {
    setContent((prev) => (prev ? `${prev} ${ph}` : ph));
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Resource title is required.';
    }

    if (type === 'Link') {
      if (!url.trim()) {
        errs.url = 'Link URL is required.';
      } else if (!/^https?:\/\//i.test(url.trim())) {
        errs.url = 'URL must start with http:// or https://';
      }
    } else if (type === 'Email Template') {
      if (!content.trim()) {
        errs.content = 'Email body is required.';
      }
    } else if (type === 'Message Template' || type === 'Note') {
      if (!content.trim()) {
        errs.content = 'Content is required.';
      }
    } else if (type === 'Checklist') {
      if (checklistItems.length === 0 && !newItemText.trim()) {
        errs.checklist = 'Please add at least one checklist item.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If user has unsaved checklist text, add it
    if (type === 'Checklist' && newItemText.trim()) {
      handleAddChecklistItem();
    }

    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: isEdit ? resource.id : undefined,
      title: title.trim(),
      category,
      type,
      description: description.trim(),
      content: content.trim(),
      emailSubject: type === 'Email Template' ? emailSubject.trim() : '',
      url: type === 'Link' ? url.trim() : '',
      checklistItems: type === 'Checklist' ? checklistItems : [],
      tags,
      favorite
    };

    onSubmit(payload, selectedFile, removeFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs transition-opacity" />

      <div className="relative z-10 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl animate-fade-in-up my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEdit ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update details, notes, or uploaded files.' : 'Add documents, templates, notes, or links to your career library.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(85vh-130px)] overflow-y-auto px-6 py-5 space-y-4 text-xs">
            {/* Common: Title */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SDE Resume v2.4, Referral Request – Google"
                className={`w-full rounded-lg border px-3 py-2 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 ${
                  errors.title
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                    : 'border-slate-300 focus:border-primary focus:ring-primary'
                }`}
              />
              {errors.title && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.title}</p>}
            </div>

            {/* Common: Category & Type selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {RESOURCE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Resource Type</label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                    setErrors({});
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Common: Optional Description */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Description <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary or context for this resource..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* CONDITIONAL FIELD: Document File Upload */}
            {type === 'Document' && (
              <div className="space-y-2 pt-1">
                <label className="block font-semibold text-slate-800">Document File</label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.pptx,.ppt"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                {/* File Dropzone */}
                {!selectedFile && !existingFile ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setFileDragOver(true); }}
                    onDragLeave={() => setFileDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                      fileDragOver ? 'border-primary bg-blue-50/40' : 'border-slate-300 hover:border-primary bg-slate-50/50'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-primary flex items-center justify-center mb-2">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-slate-800 text-xs">
                      Click to upload or drag & drop file
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      PDF, DOCX, TXT, PPTX (up to 25MB)
                    </p>
                  </div>
                ) : selectedFile ? (
                  <div className="flex items-center justify-between border border-blue-200 bg-blue-50/40 rounded-xl p-3">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <FileText className="h-5 w-5 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate text-xs">
                          {selectedFile.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatFileSize(selectedFile.size)} • New file selected
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-primary hover:underline font-semibold px-2 py-1"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : existingFile ? (
                  <div className="flex items-center justify-between border border-slate-200 bg-slate-50/60 rounded-xl p-3">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <FileText className="h-5 w-5 text-slate-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate text-xs">
                          {existingFile.fileName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatFileSize(existingFile.fileSize)} • Current document
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-primary hover:underline font-semibold px-2 py-1"
                      >
                        Replace File
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setExistingFile(null);
                          setRemoveFile(true);
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Remove attached file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : null}

                {errors.file && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.file}</p>}

                {/* Optional Document Content / Notes */}
                <div className="pt-2">
                  <label className="block font-semibold text-slate-800 mb-1">
                    Document Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="3"
                    placeholder="Add key highlights, revision points, or summary notes..."
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 placeholder-slate-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL FIELD: Link */}
            {type === 'Link' && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Destination URL <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Link2 className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/example/placement-prep"
                    className={`w-full rounded-lg border py-2 pl-9 pr-3 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 ${
                      errors.url ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-primary focus:ring-primary'
                    }`}
                  />
                </div>
                {errors.url && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.url}</p>}
              </div>
            )}

            {/* CONDITIONAL FIELD: Email Template */}
            {type === 'Email Template' && (
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Email Subject <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Application for [Role] – [Your Name] (Ref: [Job ID])"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-800">
                      Email Body <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="6"
                    placeholder="Hi [Name],\n\nI am writing to express my strong interest in the [Role] position at [Company]..."
                    className={`w-full rounded-lg border p-2.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 resize-none font-mono ${
                      errors.content ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-primary focus:ring-primary'
                    }`}
                  />
                  {errors.content && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.content}</p>}

                  {/* Insert Placeholders Helper */}
                  <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Click to Insert Placeholder
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        '[Name]', '[Company]', '[Role]', '[Job ID]',
                        '[Job Link]', '[Your Name]', '[Resume Link]',
                        '[LinkedIn Link]', '[GitHub Link]'
                      ].map((ph) => (
                        <button
                          key={ph}
                          type="button"
                          onClick={() => insertPlaceholder(ph)}
                          className="bg-white border border-slate-200 hover:border-primary hover:text-primary rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-650 transition-colors"
                        >
                          + {ph}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL FIELD: Message Template */}
            {type === 'Message Template' && (
              <div className="space-y-2">
                <label className="block font-semibold text-slate-800 mb-1">
                  Message Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="5"
                  placeholder="Hi [Name], hope you're doing well. I noticed an opening for [Role] at [Company] and would love to ask for a referral..."
                  className={`w-full rounded-lg border p-2.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 resize-none font-mono ${
                    errors.content ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.content && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.content}</p>}

                {/* Insert Placeholders Helper */}
                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Click to Insert Placeholder
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['[Name]', '[Company]', '[Role]', '[Your Name]', '[LinkedIn Link]', '[Resume Link]'].map((ph) => (
                      <button
                        key={ph}
                        type="button"
                        onClick={() => insertPlaceholder(ph)}
                        className="bg-white border border-slate-200 hover:border-primary hover:text-primary rounded px-1.5 py-0.5 text-[10px] font-medium text-slate-650 transition-colors"
                      >
                        + {ph}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONDITIONAL FIELD: Note */}
            {type === 'Note' && (
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Note Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="6"
                  placeholder="Write your study notes, revision points, architectural decisions, or interview takeaways..."
                  className={`w-full rounded-lg border p-2.5 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 resize-none ${
                    errors.content ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-slate-300 focus:border-primary focus:ring-primary'
                  }`}
                />
                {errors.content && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.content}</p>}
              </div>
            )}

            {/* CONDITIONAL FIELD: Checklist */}
            {type === 'Checklist' && (
              <div className="space-y-3">
                <label className="block font-semibold text-slate-800">Checklist Tasks</label>
                
                {/* Task Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChecklistItem();
                      }
                    }}
                    placeholder="Add checklist item (e.g. Review System Design primer)..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="py-1.5 px-3 flex items-center gap-1 text-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </Button>
                </div>

                {/* Items Stack */}
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 border border-slate-200 rounded-lg p-2 bg-slate-50/50">
                  {checklistItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-slate-400 font-mono text-[10px]">{idx + 1}.</span>
                        <span className={`truncate font-medium text-slate-800 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                          {item.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveChecklistItem(item.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5 rounded transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {checklistItems.length === 0 && (
                    <p className="text-center py-4 text-slate-400 text-xs italic">
                      No tasks added yet. Type above and click Add.
                    </p>
                  )}
                </div>
                {errors.checklist && <p className="text-[11px] text-red-500 font-medium">{errors.checklist}</p>}
              </div>
            )}

            {/* Common: Tags and Favorite Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 items-center">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Tags <span className="text-slate-400 font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. DSA, Resume, Amazon, Prep"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center pt-1 sm:pt-5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700 text-xs">
                    Mark as Favorite
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 rounded-b-xl">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{selectedFile ? 'Uploading...' : 'Saving...'}</span>
                </div>
              ) : (
                <span>{isEdit ? 'Save Changes' : 'Create Resource'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
