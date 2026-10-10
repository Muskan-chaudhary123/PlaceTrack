import React, { useState } from 'react';
import { Upload, Download, X, HelpCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Handles CSV Import placeholder notification and export download triggers.
 */
export const ContactImportExport = ({ contacts = [], customFieldsMeta = [] }) => {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleExportCSV = () => {
    if (contacts.length === 0) return;

    // Headers
    const headers = [
      'Name',
      'Company',
      'Role',
      'Email',
      'Phone',
      'Type',
      'Status',
      'Follow-up Date',
      'Source',
      'Referred',
      'Referred By',
      'Notes',
      'Favorite'
    ];

    // Append custom field headers
    customFieldsMeta.forEach((f) => {
      headers.push(f.name);
    });

    // Map rows
    const rows = contacts.map((c) => {
      const rowData = [
        c.name || '',
        c.company || '',
        c.role || '',
        c.email || '',
        c.phone || '',
        c.contactType || '',
        c.status || '',
        c.followUpDate || '',
        c.source || '',
        c.referred || 'No',
        c.referredBy || '',
        (c.notes || '').replace(/"/g, '""'), // escape double quotes
        c.favorite ? 'Yes' : 'No'
      ];

      // Append custom field values
      customFieldsMeta.forEach((f) => {
        const val = c.customFields ? c.customFields[f.id] : '';
        const displayVal = typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val;
        rowData.push(String(displayVal || ''));
      });

      return rowData.map((val) => `"${val}"`).join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // Add BOM for Excel compatibility
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'placetrack_contacts_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center space-x-2 text-xs">
      <button
        onClick={() => setShowImportModal(true)}
        type="button"
        className="flex items-center space-x-1.5 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors font-semibold"
      >
        <Upload className="h-4 w-4 text-slate-400" />
        <span>Import</span>
      </button>

      <button
        onClick={handleExportCSV}
        type="button"
        disabled={contacts.length === 0}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4 text-slate-400" />
        <span>Export CSV</span>
      </button>

      {/* CSV Import Placeholder modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div onClick={() => setShowImportModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-xs text-center space-y-4">
            <div className="rounded-full bg-blue-50 border border-blue-100 w-12 h-12 flex items-center justify-center mx-auto text-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">Import Contacts (CSV)</h4>
              <p className="text-slate-400 font-semibold leading-relaxed">
                Direct CSV import configuration will become fully available in the next stage after connecting the Django REST + MongoDB backend database integrations.
              </p>
            </div>

            <div className="pt-2">
              <Button onClick={() => setShowImportModal(false)} className="w-full">
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ContactImportExport;
