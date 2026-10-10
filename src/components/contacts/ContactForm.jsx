import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Modal form for creating and updating CRM contacts.
 * Includes email validation, referred-by toggle, custom fields loop, and duplicate checks.
 */
export const ContactForm = ({
  contact,
  onClose,
  onSubmit,
  contactsList = [],
  customFieldsMeta = []
}) => {
  const isEdit = !!contact;

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [contactType, setContactType] = useState('HR');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [status, setStatus] = useState('New');
  const [followUpDate, setFollowUpDate] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [referred, setReferred] = useState('No');
  const [referredBy, setReferredBy] = useState('');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [favorite, setFavorite] = useState(false);

  // Custom field values state
  const [customFieldValues, setCustomFieldValues] = useState({});

  // Error & Duplicate flags
  const [errors, setErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const contactTypes = ['HR', 'Recruiter', 'Hiring Manager', 'Employee', 'Referral', 'Other'];
  const statuses = ['New', 'Contacted', 'Replied', 'Follow-up', 'Closed'];
  const sources = ['LinkedIn', 'Referral', 'Company Website', 'College', 'Job Portal', 'Personal Network', 'Other'];

  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setCompany(contact.company || '');
      setRole(contact.role || '');
      setContactType(contact.contactType || 'HR');
      setEmail(contact.email || '');
      setPhone(contact.phone || '');
      setLinkedin(contact.linkedin || '');
      setCompanyWebsite(contact.companyWebsite || '');
      setStatus(contact.status || 'New');
      setFollowUpDate(contact.followUpDate || '');
      setSource(contact.source || 'LinkedIn');
      setReferred(contact.referred || 'No');
      setReferredBy(contact.referredBy || '');
      setNotes(contact.notes || '');
      setTagsInput(contact.tags ? contact.tags.join(', ') : '');
      setFavorite(!!contact.favorite);
      setCustomFieldValues(contact.customFields || {});
    } else {
      // Prefill empty custom values
      const initialValues = {};
      customFieldsMeta.forEach((f) => {
        initialValues[f.id] = f.type === 'Checkbox' ? false : '';
      });
      setCustomFieldValues(initialValues);
    }
  }, [contact, customFieldsMeta]);

  const handleCustomFieldChange = (fieldId, value) => {
    setCustomFieldValues({
      ...customFieldValues,
      [fieldId]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Contact name is required.';
    if (!company.trim()) newErrors.company = 'Company name is required.';
    
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e, forceSave = false) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    // Check duplicate if not forced
    if (!forceSave && !isEdit) {
      const duplicateByEmail = email.trim() 
        ? contactsList.find((c) => c.email && c.email.toLowerCase().trim() === email.toLowerCase().trim())
        : null;

      const duplicateByName = contactsList.find(
        (c) =>
          c.name.toLowerCase().trim() === name.toLowerCase().trim() &&
          c.company.toLowerCase().trim() === company.toLowerCase().trim()
      );

      if (duplicateByEmail) {
        setDuplicateWarning({
          message: 'A contact with the same email already exists.',
          existingId: duplicateByEmail.id
        });
        return;
      }

      if (duplicateByName) {
        setDuplicateWarning({
          message: `A contact named "${name}" at "${company}" already exists.`,
          existingId: duplicateByName.id
        });
        return;
      }
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      id: isEdit ? contact.id : `con-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      company: company.trim(),
      role: role.trim(),
      contactType,
      email: email.trim(),
      phone: phone.trim(),
      linkedin: linkedin.trim(),
      companyWebsite: companyWebsite.trim(),
      status,
      followUpDate,
      source,
      referred,
      referredBy: referred === 'Yes' ? referredBy.trim() : '',
      notes: notes.trim(),
      tags,
      favorite,
      customFields: customFieldValues,
      interactions: isEdit ? contact.interactions : [],
      createdAt: isEdit ? contact.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up flex flex-col max-h-[calc(100vh-80px)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {isEdit ? 'Edit Contact' : 'Add Contact'}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="overflow-y-auto px-6 py-4 space-y-4 text-sm flex-1">
          {duplicateWarning ? (
            /* DUPLICATE WARNING DIALOG */
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4.5 space-y-4">
              <div className="flex items-start space-x-2.5 text-amber-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-base">Possible Duplicate</h4>
                  <p className="mt-1 font-semibold text-sm leading-normal">
                    {duplicateWarning.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <a href={`/contacts/${duplicateWarning.existingId}`} className="text-primary hover:underline font-bold text-sm self-center">
                  View Existing
                </a>
                <Button type="button" variant="outline" onClick={() => setDuplicateWarning(null)}>
                  Edit Form
                </Button>
                <Button type="button" onClick={() => handleSubmit(null, true)}>
                  Add Anyway
                </Button>
              </div>
            </div>
          ) : (
            /* STANDARD FIELDS */
            <>
              {/* Name & Company */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 ${
                      errors.name ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="e.g. Rachna Gupta"
                  />
                  {errors.name && <span className="text-[10px] text-red-500 mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 ${
                      errors.company ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="e.g. ConsultAdd"
                  />
                  {errors.company && <span className="text-[10px] text-red-500 mt-1 block">{errors.company}</span>}
                </div>
              </div>

              {/* Role & Contact Type */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. HR Recruiter"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Type</label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {contactTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 ${
                      errors.email ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                    }`}
                    placeholder="e.g. name@example.com"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>
              </div>

              {/* LinkedIn & Company Website */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Status & Follow-up Date */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Source & Referral */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {sources.map((src) => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Referred?</label>
                  <select
                    value={referred}
                    onChange={(e) => setReferred(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* Referred By */}
              {referred === 'Yes' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Referred By</label>
                  <input
                    type="text"
                    value={referredBy}
                    onChange={(e) => setReferredBy(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Alumni name or referral details"
                  />
                </div>
              )}

              {/* Tags & Favorite Checkbox */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tags</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. HR, Startup, Follow-up (comma separated)"
                  />
                </div>

                <div className="flex items-center pt-5 sm:pt-4">
                  <input
                    id="favCheckbox"
                    type="checkbox"
                    checked={favorite}
                    onChange={(e) => setFavorite(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="favCheckbox" className="ml-2 font-semibold text-slate-700 select-none">
                    Mark as Favorite
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="Record summary details..."
                />
              </div>

              {/* DYNAMIC CUSTOM USER FIELDS */}
              {customFieldsMeta.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                    Custom Fields
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {customFieldsMeta.map((field) => {
                      const value = customFieldValues[field.id] !== undefined ? customFieldValues[field.id] : '';
                      return (
                        <div key={field.id}>
                          <label className="block font-semibold text-slate-700 mb-1">{field.name}</label>
                          
                          {field.type === 'Dropdown' ? (
                            <select
                              value={value}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              <option value="">Select option</option>
                              {field.options && field.options.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : field.type === 'Checkbox' ? (
                            <div className="flex items-center pt-2">
                              <input
                                id={`custom_${field.id}`}
                                type="checkbox"
                                checked={!!value}
                                onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor={`custom_${field.id}`} className="ml-2 font-semibold text-slate-700 select-none">
                                {field.name}
                              </label>
                            </div>
                          ) : field.type === 'Date' ? (
                            <input
                              type="date"
                              value={value}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          ) : field.type === 'Number' ? (
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          ) : field.type === 'URL' ? (
                            <input
                              type="url"
                              value={value}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="https://..."
                            />
                          ) : (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action buttons (Not visible if duplicate warning triggers to avoid overlaps) */}
          {!duplicateWarning && (
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-100 bg-slate-50 px-6 py-4 -mx-6 -mb-4 rounded-b-lg shrink-0">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">
                {isEdit ? 'Save Changes' : 'Add Contact'}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default ContactForm;
