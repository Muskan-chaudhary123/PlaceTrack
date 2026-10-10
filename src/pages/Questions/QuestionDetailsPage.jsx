import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, Award, Tag, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { QuestionForm } from '../../components/questions/QuestionForm';
import { formatDate } from '../../components/applications/ApplicationCard';

export const QuestionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRevisitPicker, setShowRevisitPicker] = useState(false);
  const [revisitDateInput, setRevisitDateInput] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedQs = localStorage.getItem('placetrack_questions');
    const savedApps = localStorage.getItem('placetrack_applications');
    const savedInts = localStorage.getItem('placetrack_interviews');

    if (savedApps) {
      try { setApplications(JSON.parse(savedApps)); } catch (e) {}
    }
    if (savedInts) {
      try { setInterviews(JSON.parse(savedInts)); } catch (e) {}
    }

    if (savedQs) {
      try {
        const list = JSON.parse(savedQs);
        const match = list.find((q) => q.id === id);
        if (match) {
          setQuestion(match);
          setRevisitDateInput(match.revisitDate || '');
        }
      } catch (e) {}
    }
    setLoading(false);
  }, [id]);

  const saveQuestionState = (updatedQ) => {
    setQuestion(updatedQ);

    try {
      const savedQs = JSON.parse(localStorage.getItem('placetrack_questions') || '[]');
      const updatedList = savedQs.map((q) => (q.id === updatedQ.id ? updatedQ : q));
      localStorage.setItem('placetrack_questions', JSON.stringify(updatedList));
    } catch (e) {}
  };

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleConfidenceChange = (level) => {
    const updated = {
      ...question,
      confidence: level,
      updatedAt: new Date().toISOString()
    };
    saveQuestionState(updated);
    triggerToast(`Confidence updated to: ${level}`);
  };

  const handleMarkRevised = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    

    let daysToAdd = 5;
    if (question.confidence === 'Strong') daysToAdd = 10;
    else if (question.confidence === 'Comfortable') daysToAdd = 6;
    else if (question.confidence === 'Need Revision') daysToAdd = 2;
    else if (question.confidence === "Don't Know") daysToAdd = 1;

    const nextDateObj = new Date();
    nextDateObj.setDate(nextDateObj.getDate() + daysToAdd);
    const nextRevisionStr = nextDateObj.toISOString().split('T')[0];

    const updated = {
      ...question,
      revisionStatus: 'Revised',
      lastRevised: todayStr,
      nextRevision: nextRevisionStr,
      updatedAt: new Date().toISOString()
    };

    saveQuestionState(updated);
    triggerToast('Question marked as Revised. Next revision scheduled.');
  };

  const handleScheduleRevisit = (e) => {
    e.preventDefault();
    if (!revisitDateInput) return;

    const updated = {
      ...question,
      revisitDate: revisitDateInput,
      revisionStatus: 'Revisit',
      updatedAt: new Date().toISOString()
    };
    saveQuestionState(updated);
    setShowRevisitPicker(false);
    triggerToast(`Revisit scheduled for ${formatDate(revisitDateInput)}`);
  };

  const handleEditSubmit = (updatedQ) => {
    saveQuestionState(updatedQ);
    setShowEditModal(false);
    triggerToast('Question updated successfully.');
  };

  const handleDelete = () => {
    try {
      const savedQs = JSON.parse(localStorage.getItem('placetrack_questions') || '[]');
      const updatedList = savedQs.filter((q) => q.id !== id);
      localStorage.setItem('placetrack_questions', JSON.stringify(updatedList));
      triggerToast('Question deleted.');
      navigate('/questions', { replace: true });
    } catch (e) {}
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-lg border border-slate-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-20 bg-white border border-slate-200 rounded-lg text-xs">
        <h3 className="text-base font-bold text-slate-800">Question Not Found</h3>
        <p className="text-slate-400 mt-2">The requested question entry does not exist or has been deleted.</p>
        <Link to="/questions" className="inline-block mt-6">
          <Button variant="outline" size="sm">Back to Question Bank</Button>
        </Link>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'text-emerald-600 font-semibold',
    Medium: 'text-amber-600 font-semibold',
    Hard: 'text-red-600 font-semibold'
  };

  const confidenceBadgeClasses = {
    "Don't Know": 'bg-red-50 text-red-750 border-red-200',
    'Need Revision': 'bg-orange-50 text-orange-755 border-orange-200',
    Comfortable: 'bg-blue-50 text-blue-750 border-blue-200',
    Strong: 'bg-emerald-50 text-emerald-700 border-emerald-250 font-bold'
  }[question.confidence] || 'bg-slate-50 text-slate-700';

  const freqAsked = question.companyIds && question.companyIds.length >= 3;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link to="/questions">
            <button type="button" className="p-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {question.category} {question.topic ? `· ${question.topic}` : ''}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[320px] sm:max-w-md md:max-w-lg mt-0.5">
              {question.question.slice(0, 50)}...
            </h2>
          </div>
        </div>

        {/* Actions Controls */}
        <div className="flex flex-wrap gap-2 text-sm font-medium">
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

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Columns: Question and Answer Description (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6 text-xs">
          {/* Question Text card */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Question Asked</h4>
            <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
              {question.question}
            </h3>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-2.5">
              Detailed Answer Model
            </h4>
            <div className="font-medium text-slate-655 leading-relaxed whitespace-pre-line text-[11px] font-sans">
              {question.answer || (
                <span className="italic text-slate-400 font-normal">No detailed answer model logged yet.</span>
              )}
            </div>
          </div>


          {question.quickNote && (
            <div className="rounded-lg border border-blue-150 bg-blue-50/20 p-4 leading-relaxed font-semibold text-slate-655 border-dashed">
              <span className="block text-[9px] font-bold text-slate-450 uppercase tracking-wide mb-1">Quick Revision Note</span>
              <p className="text-slate-600 text-[11px]">{question.quickNote}</p>
            </div>
          )}


          {question.companyIds && question.companyIds.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Asked By Companies</h4>
                {freqAsked && (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-3xs">
                    Frequently Asked
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {question.companyIds.map((c, i) => (
                  <span key={i} className="inline-flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors">
                    <Award className="h-3.5 w-3.5 text-slate-400" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>


        <div className="space-y-6 text-xs font-semibold">
          {/* Metadata Grid */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Concept Parameters
            </h3>

            <div className="space-y-3 font-medium text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Category</span>
                <span className="text-slate-900 font-bold">{question.category}</span>
              </div>
              {question.topic && (
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Topic</span>
                  <span className="text-slate-950 font-bold">{question.topic}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Difficulty</span>
                <span className={difficultyColors[question.difficulty]}>{question.difficulty}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-semibold">Confidence</span>
                <span className={`rounded border px-2 py-0.5 text-[9px] uppercase tracking-wide ${confidenceBadgeClasses}`}>
                  {question.confidence}
                </span>
              </div>
            </div>


            {question.tags && question.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>


          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Change Confidence</h3>
              <p className="text-[10px] text-slate-400 font-medium">Directly adjust your mastery score</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] text-center font-bold">
              {[
                { l: "Don't Know", c: 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' },
                { l: 'Need Revision', c: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100' },
                { l: 'Comfortable', c: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { l: 'Strong', c: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' }
              ].map((item) => (
                <button
                  key={item.l}
                  onClick={() => handleConfidenceChange(item.l)}
                  className={`rounded border py-2 ${item.c} ${
                    question.confidence === item.l ? 'ring-2 ring-primary border-transparent shadow-xs' : ''
                  }`}
                >
                  {item.l}
                </button>
              ))}
            </div>
          </div>


          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
              Revision Tracker
            </h3>

            <div className="space-y-3 font-medium text-slate-655">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Last Revised</span>
                <span className="text-slate-700">{question.lastRevised ? formatDate(question.lastRevised) : 'Never'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Next Revision</span>
                <span className="text-slate-700">{question.nextRevision ? formatDate(question.nextRevision) : 'Not Scheduled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Revision Status</span>
                <span className={`text-[10px] font-bold uppercase ${question.revisionStatus === 'Revised' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {question.revisionStatus || 'Not Revised'}
                </span>
              </div>
            </div>


            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Button onClick={handleMarkRevised} className="w-full py-2 px-3 text-xs flex items-center justify-center space-x-1.5">
                <CheckCircle className="h-4 w-4" />
                <span>Mark Revised</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowRevisitPicker(!showRevisitPicker)}
                className="w-full py-2 px-3 text-xs flex items-center justify-center space-x-1.5"
              >
                <Clock className="h-4 w-4" />
                <span>Schedule Revisit</span>
              </Button>

              {showRevisitPicker && (
                <form onSubmit={handleScheduleRevisit} className="pt-3 space-y-2">
                  <label className="block text-[10px] text-slate-450 font-bold mb-1">Pick Date</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={revisitDateInput}
                      onChange={(e) => setRevisitDateInput(e.target.value)}
                      required
                      className="flex-1 rounded border border-slate-300 px-3 py-1 text-xs text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <Button type="submit" size="sm">Save</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>


      {showEditModal && (
        <QuestionForm
          question={question}
          applications={applications}
          interviews={interviews}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg animate-fade-in-up text-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Delete Question?</h4>
            <p className="text-slate-500 mb-6 font-medium leading-normal">
              Are you sure you want to delete this question? This action cannot be undone.
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
export default QuestionDetailsPage;
