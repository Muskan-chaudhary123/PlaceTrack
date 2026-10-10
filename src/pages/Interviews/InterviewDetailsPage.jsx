import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle, ExternalLink, Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { InterviewForm } from '../../components/interviews/InterviewForm';
import { InterviewQuestions } from '../../components/interviews/InterviewQuestions';
import { InterviewMistakes } from '../../components/interviews/InterviewMistakes';
import { InterviewLearnings } from '../../components/interviews/InterviewLearnings';
import { ImprovementAreas } from '../../components/interviews/ImprovementAreas';
import { formatDate } from '../../components/applications/ApplicationCard';

export const InterviewDetailsPage = () => {
  const { user } = useAuth();
  const interviewsKey = user?.id ? `placetrack_interviews_${user.id}` : 'placetrack_interviews';
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal and toast states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionResult, setCompletionResult] = useState('Pending');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Read from localStorage
    const savedInts = localStorage.getItem(interviewsKey) || localStorage.getItem('placetrack_interviews');
    const savedApps = localStorage.getItem('placetrack_applications');
    
    if (savedApps) {
      try { setApplications(JSON.parse(savedApps)); } catch (e) {}
    }

    if (savedInts) {
      try {
        const list = JSON.parse(savedInts);
        const match = list.find((i) => i.id === id);
        if (match) {
          setInterview(match);
        }
      } catch (e) {}
    }
    setLoading(false);
  }, [id, interviewsKey]);

  const saveInterviewState = (updatedInterview) => {
    setInterview(updatedInterview);
    
    // Save back to master list in localStorage
    try {
      const savedInts = JSON.parse(localStorage.getItem(interviewsKey) || localStorage.getItem('placetrack_interviews') || '[]');
      const updatedList = savedInts.map((i) => (i.id === updatedInterview.id ? updatedInterview : i));
      localStorage.setItem(interviewsKey, JSON.stringify(updatedList));
      localStorage.setItem('placetrack_interviews', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Handlers for dynamic sections
  const handleQuestionsChange = (updatedQs) => {
    saveInterviewState({ ...interview, questions: updatedQs });
    triggerToast('Questions updated.');
  };

  const handleAddToQuestionBank = (q) => {
    const newQBEntry = {
      id: `qb-${Math.random().toString(36).substring(2, 9)}`,
      question: q.question,
      answer: q.myAnswer || '',
      quickNote: `Asked during ${interview.round} at ${interview.companyName}`,
      category: q.category || 'DSA',
      topic: '',
      difficulty: q.difficulty || 'Medium',
      confidence: q.performance === 'Needs Improvement' ? 'Need Revision' : q.performance === 'Good' ? 'Comfortable' : 'Strong',
      tags: ['Interview', q.category || 'DSA'],
      companyIds: [interview.companyName],
      applicationId: interview.applicationId || '',
      interviewId: interview.id,
      revisionStatus: 'Due',
      lastRevised: new Date().toISOString().split('T')[0],
      nextRevision: new Date().toISOString().split('T')[0],
      revisitDate: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const currentQs = JSON.parse(localStorage.getItem('placetrack_questions') || '[]');
      const duplicate = currentQs.find(item => item.question === newQBEntry.question);
      if (duplicate) {
        triggerToast('Question already exists in the Question Bank!', 'info');
        return;
      }
      
      const updatedList = [newQBEntry, ...currentQs];
      localStorage.setItem('placetrack_questions', JSON.stringify(updatedList));
      triggerToast('Added to Question Bank successfully!');
    } catch (e) {
      triggerToast('Failed to add to Question Bank.', 'error');
    }
  };

  const handleMistakesChange = (updatedMs) => {
    saveInterviewState({ ...interview, mistakes: updatedMs });
    triggerToast('Mistakes checklist updated.');
  };

  const handleLearningsChange = (updatedLs) => {
    saveInterviewState({ ...interview, learnings: updatedLs });
    triggerToast('Learnings checklist updated.');
  };

  const handleAreasChange = (updatedAs) => {
    saveInterviewState({ ...interview, improvementAreas: updatedAs });
    triggerToast('Revision areas updated.');
  };

  const handleRatingsChange = (updatedRs) => {
    saveInterviewState({ ...interview, ratings: updatedRs });
    triggerToast('Self evaluation ratings saved.');
  };

  // Edit / Delete Triggers
  const handleEditSubmit = (updatedInt) => {
    saveInterviewState(updatedInt);
    setShowEditModal(false);
    triggerToast('Interview updated successfully.');
  };

  const handleDelete = () => {
    try {
      const savedInts = JSON.parse(localStorage.getItem(interviewsKey) || localStorage.getItem('placetrack_interviews') || '[]');
      const updatedList = savedInts.filter((i) => i.id !== id);
      localStorage.setItem(interviewsKey, JSON.stringify(updatedList));
      localStorage.setItem('placetrack_interviews', JSON.stringify(updatedList));
      triggerToast('Interview deleted.');
      navigate('/interviews', { replace: true });
    } catch (e) {}
  };

  // Complete Interview Handler
  const handleMarkCompleteSubmit = () => {
    const updated = {
      ...interview,
      status: 'Completed',
      result: completionResult
    };
    saveInterviewState(updated);
    setShowCompleteModal(false);
    triggerToast(`Interview round marked Completed with result: ${completionResult}`);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-lg border border-slate-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-lg text-xs">
        <h3 className="text-base font-bold text-slate-800">Interview Not Found</h3>
        <p className="text-slate-400 mt-2">The requested interview record does not exist or has been deleted.</p>
        <Link to="/interviews" className="inline-block mt-6">
          <Button variant="outline" size="sm">Back to Interviews</Button>
        </Link>
      </div>
    );
  }

  const statusBadgeClass = {
    Scheduled: 'bg-blue-50 text-primary border-blue-200',
    Rescheduled: 'bg-purple-50 text-purple-700 border-purple-200',
    Cancelled: 'bg-slate-50 text-slate-500 border-slate-200',
    Completed: 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold',
    Pending: 'bg-orange-50 text-orange-700 border-orange-200'
  }[interview.status] || 'bg-slate-50 text-slate-700 border-slate-200';

  const resultBadgeClass = {
    Pending: 'bg-slate-50 text-slate-500 border-slate-200',
    Selected: 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold',
    Rejected: 'bg-red-50 text-red-700 border-red-200',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200'
  }[interview.result] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/interviews">
            <button type="button" className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {interview.round}
            </span>
            <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
              {interview.companyName}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 text-sm font-medium">
          {interview.status !== 'Completed' && (
            <Button
              onClick={() => { setCompletionResult(interview.result); setShowCompleteModal(true); }}
              className="flex items-center space-x-1.5 py-2 px-3 border-transparent"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark Completed</span>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            className="flex items-center space-x-1.5 py-2 px-3"
          >
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

      {/* Main Info Dashboard Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Questions, Mistakes, Learnings, Revision */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question bank */}
          <InterviewQuestions
            questions={interview.questions}
            onQuestionsChange={handleQuestionsChange}
            onAddToQuestionBank={handleAddToQuestionBank}
          />

          {/* Mistakes checklist */}
          <InterviewMistakes
            mistakes={interview.mistakes}
            onMistakesChange={handleMistakesChange}
          />

          {/* Learnings checklist */}
          <InterviewLearnings
            learnings={interview.learnings}
            onLearningsChange={handleLearningsChange}
          />

          {/* Revision Topics */}
          <ImprovementAreas
            areas={interview.improvementAreas}
            onAreasChange={handleAreasChange}
          />
        </div>

        {/* Right Column: Overview Panel & Ratings */}
        <div className="space-y-6">
          {/* Overview Panel */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Round Overview
            </h3>
            
            <div className="space-y-3 font-medium text-slate-650">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Company</span>
                <span className="text-slate-900 font-bold">{interview.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Role</span>
                <span className="text-slate-900 font-bold truncate max-w-[180px]">{interview.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Round Type</span>
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">{interview.round}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Scheduled Date</span>
                <span className="text-slate-700">{formatDate(interview.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Start Time</span>
                <span className="text-slate-700">{interview.time}</span>
              </div>
              {interview.duration && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Duration</span>
                  <span className="text-slate-700">{interview.duration} minutes</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Type</span>
                <span className="text-slate-700">{interview.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Status</span>
                <span className={`rounded border px-2 py-0.5 font-bold uppercase text-[9px] ${statusBadgeClass}`}>
                  {interview.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Result</span>
                <span className={`rounded border px-2 py-0.5 font-bold uppercase text-[9px] ${resultBadgeClass}`}>
                  {interview.result}
                </span>
              </div>
            </div>

            {/* Location Address */}
            {interview.location && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-start space-x-2 text-slate-655 font-medium leading-relaxed">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{interview.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditModal && (
        <InterviewForm
          interview={interview}
          applications={applications}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Delete Interview?</h4>
            <p className="text-slate-500 mb-6 font-medium leading-normal">
              Are you sure you want to delete this interview? This action cannot be undone.
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

      {/* Mark Completed Prompt Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowCompleteModal(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Mark as Completed</h4>
            <p className="text-slate-400 mb-4">Please select the result of this interview round:</p>
            
            <div className="space-y-4">
              <select
                value={completionResult}
                onChange={(e) => setCompletionResult(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-950 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="On Hold">On Hold</option>
              </select>
              
              <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4">
                <Button variant="outline" onClick={() => setShowCompleteModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMarkCompleteSubmit}>
                  Confirm Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
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
export default InterviewDetailsPage;
