import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Settings, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ContactFilters } from '../../components/contacts/ContactFilters';
import { ContactTable } from '../../components/contacts/ContactTable';
import { ContactCard } from '../../components/contacts/ContactCard';
import { ContactForm } from '../../components/contacts/ContactForm';
import { CustomFieldsManager } from '../../components/contacts/CustomFieldsManager';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

export const Contacts = () => {
  const { user } = useAuth();
  const contactsKey = user?.id ? `placetrack_contacts_${user.id}` : 'placetrack_contacts';
  const navigate = useNavigate();

  // Primary States
  const [contacts, setContacts] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [customFieldsMeta, setCustomFieldsMeta] = useState([]);

  // Filtering / Tabs & Sorting State
  const [activeTab, setActiveTab] = useState('All Contacts');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [followUpFilter, setFollowUpFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Added');

  // Modals & Toast
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [toast, setToast] = useState(null);

  const baseDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // 1. Contacts
    let loadedContacts = [];
    const savedContacts = localStorage.getItem(contactsKey) || (!user?.id ? localStorage.getItem('placetrack_contacts') : null);
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts);
        if (Array.isArray(parsed)) {
          loadedContacts = parsed.filter((c) => !c.isDemo && !String(c.id || '').startsWith('con-'));
        }
      } catch (err) {
        loadedContacts = [];
      }
    }
    setContacts(loadedContacts);

    // 2. Custom fields metadata definition
    const savedFields = localStorage.getItem('placetrack_custom_fields');
    const defaultFields = [
      { id: 'referralStatus', name: 'Referral Status', type: 'Dropdown', options: ['Not Asked', 'Asked', 'Referred', 'Rejected'] },
      { id: 'priority', name: 'Priority', type: 'Dropdown', options: ['Low', 'Medium', 'High'] }
    ];
    if (savedFields) {
      try { setCustomFieldsMeta(JSON.parse(savedFields)); } catch (e) { setCustomFieldsMeta(defaultFields); }
    } else {
      localStorage.setItem('placetrack_custom_fields', JSON.stringify(defaultFields));
      setCustomFieldsMeta(defaultFields);
    }

    // 3. Visible columns list
    const savedCols = localStorage.getItem('placetrack_visible_columns');
    const defaultCols = ['name', 'company', 'role', 'email', 'contactType', 'status', 'followUpDate'];
    if (savedCols) {
      try { setVisibleColumns(JSON.parse(savedCols)); } catch (e) { setVisibleColumns(defaultCols); }
    } else {
      localStorage.setItem('placetrack_visible_columns', JSON.stringify(defaultCols));
      setVisibleColumns(defaultCols);
    }
  }, [contactsKey, user?.id]);

  const saveContacts = (updated) => {
    setContacts(updated);
    localStorage.setItem(contactsKey, JSON.stringify(updated));
    localStorage.setItem('placetrack_contacts', JSON.stringify(updated));
  };

  const saveCustomFieldsMeta = (updated) => {
    setCustomFieldsMeta(updated);
    localStorage.setItem('placetrack_custom_fields', JSON.stringify(updated));
  };

  const saveVisibleColumns = (updated) => {
    setVisibleColumns(updated);
    localStorage.setItem('placetrack_visible_columns', JSON.stringify(updated));
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Toggle Favorite
  const handleToggleFav = (id) => {
    const updated = contacts.map((c) =>
      c.id === id ? { ...c, favorite: !c.favorite, updatedAt: new Date().toISOString() } : c
    );
    saveContacts(updated);
    const target = updated.find((c) => c.id === id);
    triggerToast(target.favorite ? 'Marked as favorite.' : 'Removed from favorites.', 'info');
  };

  // Create Contact Handler
  const handleAddContact = (newContact) => {
    const updated = [newContact, ...contacts];
    saveContacts(updated);
    setShowAddModal(false);
    triggerToast('Contact added successfully!');
  };

  // Custom Fields Actions
  const handleAddCustomField = (newField) => {
    const updatedMeta = [...customFieldsMeta, newField];
    saveCustomFieldsMeta(updatedMeta);

    // Auto add to visible columns
    const updatedCols = [...visibleColumns, newField.id];
    saveVisibleColumns(updatedCols);

    // Prepopulate empty values in contacts list
    const updatedContacts = contacts.map((c) => ({
      ...c,
      customFields: {
        ...c.customFields,
        [newField.id]: newField.type === 'Checkbox' ? false : ''
      }
    }));
    saveContacts(updatedContacts);

    triggerToast(`Custom field "${newField.name}" added successfully.`);
  };

  const handleRenameCustomField = (fieldId, newName) => {
    const updatedMeta = customFieldsMeta.map((f) => (f.id === fieldId ? { ...f, name: newName } : f));
    saveCustomFieldsMeta(updatedMeta);
    triggerToast('Field renamed.');
  };

  const handleDeleteCustomField = (fieldId) => {
    // Remove from customFields metadata list
    const updatedMeta = customFieldsMeta.filter((f) => f.id !== fieldId);
    saveCustomFieldsMeta(updatedMeta);

    // Remove from visible columns
    const updatedCols = visibleColumns.filter((c) => c !== fieldId);
    saveVisibleColumns(updatedCols);

    // Remove key from all contacts customFields entries
    const updatedContacts = contacts.map((c) => {
      const nextFields = { ...c.customFields };
      delete nextFields[fieldId];
      return { ...c, customFields: nextFields };
    });
    saveContacts(updatedContacts);

    triggerToast('Custom field deleted.');
  };

  // Compute Unique Companies list for select filter dropdown
  const uniqueCompanies = [...new Set(contacts.map((c) => c.company))].filter(Boolean).sort();

  // Filters & Sorting logic
  const getFilteredAndSorted = () => {
    let result = [...contacts];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.role && c.role.toLowerCase().includes(q)) ||
          (c.notes && c.notes.toLowerCase().includes(q))
      );
    }

    // 2. Tabs Filters
    if (activeTab === 'HR & Recruiters') {
      result = result.filter((c) => c.contactType === 'HR' || c.contactType === 'Recruiter');
    } else if (activeTab === 'Referrals') {
      result = result.filter((c) => c.contactType === 'Referral' || c.referred === 'Yes');
    } else if (activeTab === 'Follow-ups') {
      result = result.filter((c) => c.followUpDate && c.followUpDate.trim() !== '' && c.status !== 'Closed');
    }

    // 3. Dropdown Contact Type Filter
    if (typeFilter !== 'All') {
      result = result.filter((c) => c.contactType === typeFilter);
    }

    // 4. Dropdown Company Filter
    if (companyFilter !== 'All') {
      result = result.filter((c) => c.company === companyFilter);
    }

    // 5. Dropdown Status Filter
    if (statusFilter !== 'All') {
      result = result.filter((c) => c.status === statusFilter);
    }

    // 6. Dropdown Follow-up Filter
    if (followUpFilter !== 'All') {
      if (followUpFilter === 'No Follow-up') {
        result = result.filter((c) => !c.followUpDate || c.followUpDate.trim() === '');
      } else if (followUpFilter === 'Due Today') {
        result = result.filter((c) => c.followUpDate === baseDate && c.status !== 'Closed');
      } else if (followUpFilter === 'Due Soon') {
        // Date range between today and next 3 days
        const limitDate = new Date(baseDate);
        limitDate.setDate(limitDate.getDate() + 3);
        const limitStr = limitDate.toISOString().split('T')[0];
        result = result.filter(
          (c) => c.followUpDate && c.followUpDate >= baseDate && c.followUpDate <= limitStr && c.status !== 'Closed'
        );
      } else if (followUpFilter === 'Overdue') {
        result = result.filter((c) => c.followUpDate && c.followUpDate < baseDate && c.status !== 'Closed');
      }
    }

    // 7. Sorting
    result.sort((a, b) => {
      if (sortBy === 'Recently Added') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'Name A-Z') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'Name Z-A') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'Company A-Z') {
        return a.company.localeCompare(b.company);
      }
      if (sortBy === 'Follow-up Date') {
        if (!a.followUpDate) return 1;
        if (!b.followUpDate) return -1;
        return a.followUpDate.localeCompare(b.followUpDate);
      }
      if (sortBy === 'Most Contacted') {
        const countA = a.interactions ? a.interactions.length : 0;
        const countB = b.interactions ? b.interactions.length : 0;
        return countB - countA;
      }
      return 0;
    });

    return result;
  };

  const filteredContacts = getFilteredAndSorted();

  const tabs = ['All Contacts', 'HR & Recruiters', 'Referrals', 'Follow-ups'];

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Contacts & HR
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
            Manage recruiters, HR contacts, referral connections, and follow-ups in one place.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Settings button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            type="button"
            className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors flex items-center justify-center shrink-0 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
            title="Customize Fields & Columns"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto text-sm sm:text-base py-2.5 px-4.5 flex items-center justify-center space-x-2 font-medium shadow-xs"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Contact</span>
          </Button>
        </div>
      </div>

      {/* Import/Export + Top Tabs Layout bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-700">
        <div className="flex overflow-x-auto no-scrollbar py-1 space-x-5 text-sm sm:text-[15px] font-semibold -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
              className={`pb-3 border-b-2 px-1 whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-655 hover:border-slate-350'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* Filters Select Panel */}
      <ContactFilters
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        companyFilter={companyFilter}
        onCompanyFilterChange={setCompanyFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        followUpFilter={followUpFilter}
        onFollowUpFilterChange={setFollowUpFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        companies={uniqueCompanies}
      />

      {/* Main Table / Mobile Card Layouts */}
      {contacts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No contacts yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Keep track of recruiters, alumni referrals, and company connections with follow-up dates.
          </p>
          <div className="mt-4.5">
            <Button
              onClick={() => setShowAddModal(true)}
              className="text-sm py-2 px-4 inline-flex items-center space-x-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-400 font-semibold">
          {activeTab === 'Follow-ups' ? 'No follow-ups due.' : 'No contacts found matching your criteria.'}
        </div>
      ) : (
        <>
          {/* Desktop Table view */}
          <div className="hidden md:block">
            <ContactTable
              contacts={filteredContacts}
              visibleColumns={visibleColumns}
              customFieldsMeta={customFieldsMeta}
              onOpenDetails={(id) => navigate(`/contacts/${id}`)}
              onToggleFav={handleToggleFav}
              baseDate={baseDate}
            />
          </div>

          {/* Mobile Card grid view */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
            {filteredContacts.map((c) => (
              <ContactCard
                key={c.id}
                contact={c}
                onOpenDetails={(id) => navigate(`/contacts/${id}`)}
                onToggleFav={handleToggleFav}
                baseDate={baseDate}
              />
            ))}
          </div>
        </>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <ContactForm
          contactsList={contacts}
          customFieldsMeta={customFieldsMeta}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddContact}
        />
      )}

      {/* Customize Settings Modal */}
      {showSettingsModal && (
        <CustomFieldsManager
          visibleColumns={visibleColumns}
          onUpdateVisibleColumns={saveVisibleColumns}
          customFields={customFieldsMeta}
          onAddCustomField={handleAddCustomField}
          onRenameCustomField={handleRenameCustomField}
          onDeleteCustomField={handleDeleteCustomField}
          onClose={() => setShowSettingsModal(false)}
        />
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
export default Contacts;
