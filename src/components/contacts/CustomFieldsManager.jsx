import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Settings panel modal for showing/hiding columns and managing custom CRM database fields.
 */
export const CustomFieldsManager = ({
  visibleColumns = [],
  onUpdateVisibleColumns,
  customFields = [],
  onAddCustomField,
  onRenameCustomField,
  onDeleteCustomField,
  onClose
}) => {
  // Visible fields states
  const coreColumns = [
    { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'contactType', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'followUpDate', label: 'Follow-up' },
    { key: 'source', label: 'Source' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'notes', label: 'Notes' }
  ];

  // Form states for creating custom field
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('Text');
  const [dropdownOptions, setDropdownOptions] = useState('');
  const [formError, setFormError] = useState('');

  // Rename states
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editFieldName, setEditFieldName] = useState('');

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleToggleCol = (colKey) => {
    if (colKey === 'name') return; // Name must remain visible
    const isVisible = visibleColumns.includes(colKey);
    const updated = isVisible
      ? visibleColumns.filter((c) => c !== colKey)
      : [...visibleColumns, colKey];
    onUpdateVisibleColumns(updated);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!newFieldName.trim()) {
      setFormError('Field name is required.');
      return;
    }

    const fieldId = newFieldName.toLowerCase().trim().replace(/\s+/g, '_');
    
    // Check duplication with core or existing
    if (coreColumns.some((col) => col.key === fieldId) || customFields.some((f) => f.id === fieldId)) {
      setFormError('A field with this name already exists.');
      return;
    }

    let parsedOptions = [];
    if (newFieldType === 'Dropdown') {
      parsedOptions = dropdownOptions
        .split(',')
        .map((opt) => opt.trim())
        .filter(Boolean);
      if (parsedOptions.length === 0) {
        setFormError('Please enter at least one option for dropdown.');
        return;
      }
    }

    onAddCustomField({
      id: fieldId,
      name: newFieldName.trim(),
      type: newFieldType,
      options: parsedOptions
    });

    // Reset states
    setNewFieldName('');
    setNewFieldType('Text');
    setDropdownOptions('');
  };

  const handleStartRename = (field) => {
    setEditingFieldId(field.id);
    setEditFieldName(field.name);
  };

  const handleSaveRename = (fieldId) => {
    if (!editFieldName.trim()) return;
    onRenameCustomField(fieldId, editFieldName.trim());
    setEditingFieldId(null);
  };

  const handleDeleteConfirm = (fieldId) => {
    onDeleteCustomField(fieldId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up text-xs flex flex-col max-h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <h3 className="text-sm font-bold text-slate-900">
            Customize Columns & CRM Fields
          </h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
          {/* Section 1: Visibility */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider pb-1.5 border-b border-slate-100">
              Show / Hide Columns
            </h4>
            <div className="grid grid-cols-2 gap-2.5 font-semibold text-slate-700">
              {coreColumns.map((col) => (
                <label
                  key={col.key}
                  className={`flex items-center space-x-2 p-2 rounded border transition-all cursor-pointer ${
                    col.key === 'name' ? 'bg-slate-50 border-slate-150 opacity-60 cursor-not-allowed' : 'hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => handleToggleCol(col.key)}
                    disabled={col.key === 'name'}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary disabled:bg-slate-100"
                  />
                  <span>{col.label}</span>
                </label>
              ))}

              {customFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center space-x-2 p-2 rounded border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(field.id)}
                    onChange={() => handleToggleCol(field.id)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="truncate max-w-[120px]">{field.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Manage Custom Fields List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider pb-1.5 border-b border-slate-100">
              Manage Custom Fields ({customFields.length})
            </h4>

            <div className="space-y-2">
              {customFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-655"
                >
                  {editingFieldId === field.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <input
                        type="text"
                        value={editFieldName}
                        onChange={(e) => setEditFieldName(e.target.value)}
                        className="rounded border border-slate-300 bg-white px-2 py-1 flex-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <Button onClick={() => handleSaveRename(field.id)} className="py-1 px-2.5">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1 truncate pr-2">
                      <span className="font-bold text-slate-905">{field.name}</span>
                      <span className="ml-2 text-[9px] bg-slate-200 rounded px-1.5 py-0.5 text-slate-500 uppercase tracking-wide">
                        {field.type}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    {editingFieldId !== field.id && (
                      <button
                        onClick={() => handleStartRename(field)}
                        type="button"
                        className="p-1 rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                        title="Rename Field"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmDeleteId(field.id)}
                      type="button"
                      className="p-1 rounded text-slate-400 hover:bg-red-50 hover:text-red-655"
                      title="Delete Field"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {customFields.length === 0 && (
                <div className="text-center py-4 text-slate-400 italic font-medium">
                  No custom fields created yet. Create one below!
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Add Custom Field Form */}
          <div className="rounded-lg border border-dashed border-slate-200 p-4 bg-slate-50/20 space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center space-x-1">
              <Plus className="h-4 w-4 text-primary" />
              <span>Add Custom Field</span>
            </h4>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Field Name</label>
                  <input
                    type="text"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Referral Status"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Field Type</label>
                  <select
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Date">Date</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Checkbox">Checkbox</option>
                    <option value="URL">URL</option>
                  </select>
                </div>
              </div>

              {/* Conditional dropdown options */}
              {newFieldType === 'Dropdown' && (
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    Dropdown Options (comma separated)
                  </label>
                  <textarea
                    value={dropdownOptions}
                    onChange={(e) => setDropdownOptions(e.target.value)}
                    rows="2"
                    className="w-full rounded border border-slate-300 px-3 py-1.5 text-slate-905 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="e.g. Not Asked, Asked, Referred, Rejected"
                  />
                </div>
              )}

              {formError && (
                <div className="text-[10px] text-red-500 font-bold flex items-center space-x-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" size="sm" className="px-4">
                  Add Field
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-lg flex justify-end shrink-0">
          <Button onClick={onClose}>Close Settings</Button>
        </div>
      </div>

      {/* Delete Field Confirmation Portal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div onClick={() => setConfirmDeleteId(null)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
          <div className="relative z-10 w-full max-w-xs rounded-lg border border-slate-200 bg-white p-5 shadow-xl text-xs">
            <h4 className="font-bold text-slate-900 mb-1.5">Delete Custom Field?</h4>
            <p className="text-slate-500 mb-5 font-semibold leading-normal">
              Deleting this field will remove it and any associated values from all contacts permanently.
            </p>
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleDeleteConfirm(confirmDeleteId)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomFieldsManager;
