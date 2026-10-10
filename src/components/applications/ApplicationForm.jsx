import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';


export const ApplicationForm = ({ application, onClose, onSubmit }) => {
  const isEdit = !!application;
  
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    jobId: '',
    location: '',
    jobLink: '',
    appliedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    source: 'Company Website',
    status: 'Applied',
    recruiter: '',
    referral: 'No',
    salary: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (application) {
      setFormData({
        companyName: application.companyName || '',
        role: application.role || '',
        jobId: application.jobId || '',
        location: application.location || '',
        jobLink: application.jobLink || '',
        appliedDate: application.appliedDate || new Date().toISOString().split('T')[0],
        deadline: application.deadline || '',
        source: application.source || 'Company Website',
        status: application.status || 'Applied',
        recruiter: application.recruiter || '',
        referral: application.referral || 'No',
        salary: application.salary || '',
        notes: application.notes || ''
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required.';
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Role title is required.';
    }
    if (!formData.appliedDate) {
      newErrors.appliedDate = 'Applied date is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      ...formData,
      id: isEdit ? application.id : `app-${Math.random().toString(36).substring(2, 9)}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 px-6 py-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Application' : 'Add Application'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form  */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-4 space-y-4 text-sm">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                    errors.companyName ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="e.g. Google"
                />
                {errors.companyName && <span className="text-[10px] text-red-500 mt-1 block">{errors.companyName}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Role Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                    errors.role ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                  placeholder="e.g. SDE Intern"
                />
                {errors.role && <span className="text-[10px] text-red-500 mt-1 block">{errors.role}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job ID / Code</label>
                <input
                  type="text"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. G-SWE-102"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. Bangalore, IN"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Applied Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 ${
                    errors.appliedDate ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                  }`}
                />
                {errors.appliedDate && <span className="text-[10px] text-red-500 mt-1 block">{errors.appliedDate}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="Company Website">Company Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="College">College</option>
                  <option value="Job Portal">Job Portal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="Applied">Applied</option>
                  <option value="OA">OA</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>
            </div>

            {/* Recruiter & Referral */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recruiter Name / Email</label>
                <input
                  type="text"
                  name="recruiter"
                  value={formData.recruiter}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Has Referral?</label>
                <select
                  name="referral"
                  value={formData.referral}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Post Link</label>
                <input
                  type="url"
                  name="jobLink"
                  value={formData.jobLink}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. https://google.com/jobs/..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Salary / Stipend</label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="e.g. ₹60,000 / month"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                placeholder="Interview formats, key syllabus, follow-up logs..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-lg">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ApplicationForm;
