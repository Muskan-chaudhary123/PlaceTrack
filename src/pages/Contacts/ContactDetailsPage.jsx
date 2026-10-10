import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Star, Mail, ExternalLink, Calendar, Plus, FileText, ChevronRight, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { ContactForm } from '../../components/contacts/ContactForm';
import { FollowUpForm } from '../../components/contacts/FollowUpForm';
import { ContactInteractions } from '../../components/contacts/ContactInteractions';
import { formatDate } from '../../components/applications/ApplicationCard';

export const ContactDetailsPage = () => {
  const { user } = useAuth();
  const contactsKey = user?.id ? `placetrack_contacts_${user.id}` : 'placetrack_contacts';
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic related data counts
  const [appCount, setAppCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  // Available Resources/Templates for compilation
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [compiledText, setCompiledText] = useState('');

  // Modals & Toast
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [toast, setToast] = useState(null);

  const baseDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 1. Load Contact details
    const saved = localStorage.getItem(contactsKey) || localStorage.getItem('placetrack_contacts');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const match = list.find((c) => c.id === id);
        if (match) {
          setContact(match);
          
          // 2. Count related applications & interviews
          const savedApps = JSON.parse(localStorage.getItem('placetrack_applications') || '[]');
          const companyApps = savedApps.filter((a) => a.companyName.toLowerCase().trim() === match.company.toLowerCase().trim());
          setAppCount(companyApps.length);

          const savedInts = JSON.parse(localStorage.getItem('placetrack_interviews') || '[]');
          const companyInts = savedInts.filter((i) => i.companyName.toLowerCase().trim() === match.company.toLowerCase().trim());
          setInterviewCount(companyInts.length);
        }
      } catch (e) {}
    }
    setLoading(false);

    // 3. Load Templates from Resources
    const savedRes = localStorage.getItem('placetrack_resources');
    if (savedRes) {
      try {
        const resList = JSON.parse(savedRes);
        const filtered = resList.filter((r) => r.type === 'Email Template' || r.type === 'Message Template');
        setTemplates(filtered);
      } catch (e) {
        setTemplates([]);
      }
    } else {
      setTemplates([]);
    }
  }, [id]);

  const saveContactState = (updatedCon) => {
    setContact(updatedCon);

    try {
      const saved = JSON.parse(localStorage.getItem(contactsKey) || localStorage.getItem('placetrack_contacts') || '[]');
      const updatedList = saved.map((c) => (c.id === updatedCon.id ? updatedCon : c));
      localStorage.setItem(contactsKey, JSON.stringify(updatedList));
      localStorage.setItem('placetrack_contacts', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toggle Favorite
  const handleToggleFav = () => {
    const updated = {
      ...contact,
      favorite: !contact.favorite,
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    triggerToast(updated.favorite ? 'Added to favorites.' : 'Removed from favorites.', 'info');
  };

  // Edit / Delete CRM Actions
  const handleEditSubmit = (updatedCon) => {
    saveContactState(updatedCon);
    setShowEditModal(false);
    triggerToast('Contact updated successfully.');
  };

  const handleDelete = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(contactsKey) || localStorage.getItem('placetrack_contacts') || '[]');
      const updatedList = saved.filter((c) => c.id !== id);
      localStorage.setItem(contactsKey, JSON.stringify(updatedList));
      localStorage.setItem('placetrack_contacts', JSON.stringify(updatedList));
      triggerToast('Contact deleted.');
      navigate('/contacts', { replace: true });
    } catch (e) {}
  };

  // Follow-up Actions
  const handleFollowUpSubmit = (fuData) => {
    const updated = {
      ...contact,
      followUp: fuData,
      followUpDate: fuData ? fuData.date : '',
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    setShowFollowUpModal(false);
    triggerToast('Follow-up scheduled.');
  };

  const handleMarkFollowUpDone = () => {
    if (!contact.followUp) return;
    const updatedFu = {
      ...contact.followUp,
      completed: true
    };
    const updated = {
      ...contact,
      followUp: updatedFu,
      // Clear followUpDate from active directory alerts since it is finished
      followUpDate: '',
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    triggerToast('Follow-up marked completed.');
  };

  const handleDeleteFollowUp = () => {
    const updated = {
      ...contact,
      followUp: null,
      followUpDate: '',
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    triggerToast('Follow-up cancelled.');
  };

  // Interactions Timeline CRUD
  const handleAddInteraction = (newInt) => {
    const list = contact.interactions ? [...contact.interactions] : [];
    const updated = {
      ...contact,
      interactions: [...list, newInt],
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    triggerToast('Interaction recorded.');
  };

  const handleEditInteraction = (updatedInt) => {
    const list = contact.interactions ? contact.interactions : [];
    const updatedList = list.map((i) => (i.id === updatedInt.id ? updatedInt : i));
    const updated = {
      ...contact,
      interactions: updatedList,
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    triggerToast('Interaction notes saved.');
  };

  const handleDeleteInteraction = (intId) => {
    const list = contact.interactions ? contact.interactions : [];
    const updatedList = list.filter((i) => i.id !== intId);
    const updated = {
      ...contact,
      interactions: updatedList,
      updatedAt: new Date().toISOString()
    };
    saveContactState(updated);
    triggerToast('Interaction note deleted.', 'info');
  };

  // Template Placeholder Compiler Logic
  const handleSelectTemplate = (tempId) => {
    const temp = templates.find((t) => t.id === tempId);
    if (!temp) return;
    setSelectedTemplate(temp);

    // Compile values
    let compiled = temp.content || '';
    compiled = compiled.replace(/\[Name\]/g, contact.name || '');
    compiled = compiled.replace(/\[Company\]/g, contact.company || '');
    compiled = compiled.replace(/\[Role\]/g, contact.role || '[Role]');
    compiled = compiled.replace(/\[Your Name\]/g, 'User');
    compiled = compiled.replace(/\[Resume Link\]/g, 'https://link-to-my-resume.pdf');
    compiled = compiled.replace(/\[LinkedIn Link\]/g, 'https://linkedin.com/in/my-profile');
    compiled = compiled.replace(/\[GitHub Link\]/g, 'https://github.com/my-github');
    compiled = compiled.replace(/\[Job ID\]/g, '10294');
    compiled = compiled.replace(/\[Job Link\]/g, 'https://careers.company.com/job');

    setCompiledText(compiled);
  };

  const handleCopyCompiled = () => {
    navigator.clipboard.writeText(compiledText);
    triggerToast('Template copied.');
    setShowTemplateModal(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-lg border border-slate-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-lg text-xs">
        <h3 className="text-base font-bold text-slate-800">Contact Not Found</h3>
        <p className="text-slate-400 mt-2">The requested contact does not exist or has been deleted.</p>
        <Link to="/contacts" className="inline-block mt-6">
          <Button variant="outline" size="sm">Back to Contacts</Button>
        </Link>
      </div>
    );
  }

  // Follow-up status indicators
  const getFollowUpStatusBadge = (fu) => {
    if (!fu) return null;
    if (fu.completed) return <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-wider text-[8px] font-bold">Completed</span>;
    if (fu.date < baseDate) return <span className="bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded-full uppercase tracking-wider text-[8px] font-bold">Overdue</span>;
    if (fu.date === baseDate) return <span className="bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-wider text-[8px] font-bold">Due Today</span>;
    return <span className="bg-blue-50 border border-blue-105 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider text-[8px] font-bold">Upcoming</span>;
  };

  const hasFollowUp = !!contact.followUp;

  return (
    <div className="space-y-6 max-w-5xl mx-auto text-xs font-semibold text-slate-655">
      {/* Top Breadcrumb toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/contacts">
            <button type="button" className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {contact.company}
              </span>
              <span className="bg-slate-100 text-slate-700 rounded-md border border-slate-200 px-2 py-0.5 text-xs sm:text-sm font-semibold uppercase tracking-wide dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                {contact.contactType}
              </span>
            </div>
            <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white leading-tight mt-1">
              {contact.name}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 text-sm font-medium">
          {/* Favorite toggle */}
          <button
            onClick={handleToggleFav}
            type="button"
            className="p-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors flex items-center justify-center"
            title={contact.favorite ? 'Remove Favorite' : 'Mark Favorite'}
          >
            <Star className={`h-4 w-4 ${contact.favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          </button>

          {/* Use Template */}
          <Button
            variant="outline"
            onClick={() => { setSelectedTemplate(null); setCompiledText(''); setShowTemplateModal(true); }}
            className="flex items-center space-x-1.5 py-2 px-3 border-blue-200 bg-blue-50/20 text-primary hover:bg-blue-50"
          >
            <FileText className="h-4 w-4" />
            <span>Use Template</span>
          </Button>

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

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Properties & Notes (Spans 1 col) */}
        <div className="space-y-6">
          
          {/* Properties Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Contact Information
            </h3>

            <div className="space-y-3 font-medium text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Email</span>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline font-bold truncate max-w-[150px]">
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Phone</span>
                <span className="text-slate-800 font-semibold">{contact.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">LinkedIn</span>
                {contact.linkedin ? (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold inline-flex items-center gap-0.5">
                    <span>View Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Website</span>
                {contact.companyWebsite ? (
                  <a href={contact.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold truncate max-w-[130px] inline-flex items-center gap-0.5">
                    <span>Visit Site</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">Not provided</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Designation</span>
                <span className="text-slate-850 font-semibold">{contact.role || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Type</span>
                <span className="text-slate-850 font-bold">{contact.contactType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Source</span>
                <span className="text-slate-700">{contact.source}</span>
              </div>
              {contact.referred === 'Yes' && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold font-bold text-emerald-650">Referred By</span>
                  <span className="text-emerald-700 font-bold">{contact.referredBy || 'Alumni'}</span>
                </div>
              )}
            </div>

            {/* Custom fields stack */}
            {contact.customFields && Object.keys(contact.customFields).length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Custom Attributes</span>
                <div className="space-y-2.5 font-medium text-slate-655">
                  {Object.entries(contact.customFields).map(([key, val]) => {
                    if (val === undefined || val === '') return null;
                    const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val;
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">{key.replace(/_/g, ' ')}</span>
                        <span className="text-slate-905 font-bold truncate max-w-[130px]">{displayVal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags Stack */}
            {contact.tags && contact.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag) => (
                    <span key={tag} className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Company info Card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Company Pipeline
            </h3>
            <div className="space-y-4 font-bold text-[10px]">
              <div>
                <span className="block text-slate-400 uppercase tracking-wide mb-0.5">Company Name</span>
                <span className="text-sm font-bold text-slate-900">{contact.company}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded bg-slate-50 border border-slate-150 p-2">
                  <span className="block text-slate-400 uppercase tracking-wider text-[8px]">Applications</span>
                  <span className="block text-sm text-slate-900 font-bold mt-0.5">{appCount}</span>
                </div>
                <div className="rounded bg-slate-50 border border-slate-150 p-2">
                  <span className="block text-slate-400 uppercase tracking-wider text-[8px]">Interviews</span>
                  <span className="block text-sm text-slate-900 font-bold mt-0.5">{interviewCount}</span>
                </div>
              </div>
              
              <div className="flex justify-end pt-1">
                <Link to="/applications" className="text-primary hover:underline font-bold inline-flex items-center gap-0.5">
                  <span>View Pipeline</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction timeline & follow-up scheduler (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Follow-up Scheduler widget */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-1.5">
                <Calendar className="h-4.5 w-4.5 text-slate-400" />
                <span>Follow-up Reminders</span>
              </h3>
              
              {!hasFollowUp && (
                <Button
                  onClick={() => setShowFollowUpModal(true)}
                  className="text-[10px] py-1 px-2.5 flex items-center space-x-1 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 border"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Schedule Follow-up</span>
                </Button>
              )}
            </div>

            {hasFollowUp ? (
              <div className="p-4 rounded bg-slate-50 border border-slate-150 relative space-y-3 font-semibold">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider">Follow-up Date</span>
                    <span className="text-sm font-bold text-slate-850 block mt-0.5">
                      {formatDate(contact.followUp.date)}
                    </span>
                  </div>
                  {getFollowUpStatusBadge(contact.followUp)}
                </div>

                {contact.followUp.note && (
                  <div className="text-[11px] text-slate-550 italic leading-relaxed">
                    "{contact.followUp.note}"
                  </div>
                )}

                {contact.followUp.reminder && contact.followUp.reminder !== 'None' && (
                  <span className="block text-[9px] text-slate-400">
                    Reminder set: {contact.followUp.reminder}
                  </span>
                )}

                {/* Follow-up actions */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200/60 text-xs">
                  {!contact.followUp.completed && (
                    <Button onClick={handleMarkFollowUpDone} size="sm" className="py-1 px-2.5 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Mark Done</span>
                    </Button>
                  )}
                  <Button onClick={() => setShowFollowUpModal(true)} size="sm" variant="outline" className="py-1 px-2.5">
                    Edit
                  </Button>
                  <Button onClick={handleDeleteFollowUp} size="sm" variant="danger" className="py-1 px-2.5 bg-red-50 border-red-200 text-red-655 hover:bg-red-100">
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 italic bg-slate-50/50 border border-slate-200 border-dashed rounded-lg">
                No follow-ups due.
              </div>
            )}
          </div>

          {/* Interactions Logger component */}
          <ContactInteractions
            interactions={contact.interactions}
            onAddInteraction={handleAddInteraction}
            onEditInteraction={handleEditInteraction}
            onDeleteInteraction={handleDeleteInteraction}
          />
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditModal && (
        <ContactForm
          contact={contact}
          contactsList={[]}
          customFieldsMeta={[]}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Follow-up Form Modal */}
      {showFollowUpModal && (
        <FollowUpForm
          followUp={contact.followUp}
          onClose={() => setShowFollowUpModal(false)}
          onSubmit={handleFollowUpSubmit}
        />
      )}

      {/* Use Template Selection slide modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowTemplateModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up space-y-4 max-h-[calc(100vh-80px)] flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 shrink-0">
              <h4 className="font-bold text-slate-900">Compile Outreach Message</h4>
              <button onClick={() => setShowTemplateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1 pb-4">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Select Template</label>
                <select
                  value={selectedTemplate ? selectedTemplate.id : ''}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Choose a Resource Template --</option>
                  {templates.map((temp) => (
                    <option key={temp.id} value={temp.id}>{temp.title} ({temp.type})</option>
                  ))}
                </select>
              </div>

              {selectedTemplate && (
                <div className="space-y-2">
                  <label className="block text-slate-500 font-semibold">Compiled Content Preview</label>
                  <textarea
                    value={compiledText}
                    onChange={(e) => setCompiledText(e.target.value)}
                    rows="10"
                    className="w-full rounded border border-slate-300 px-3 py-2 text-slate-905 focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[10px] leading-relaxed resize-none bg-slate-50/30"
                  />
                  <span className="block text-[9px] text-slate-400 font-bold">
                    All placeholders like [Name] and [Company] have been automatically filled. You can edit the compiled text before copying.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-lg shrink-0">
              <Button variant="outline" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
              <Button disabled={!selectedTemplate} onClick={handleCopyCompiled}>
                Copy Compiled Template
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlays */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Delete Contact?</h4>
            <p className="text-slate-505 mb-6 font-medium leading-normal">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Toast messages */}
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
export default ContactDetailsPage;
