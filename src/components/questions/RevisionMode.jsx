import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronRight, X, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Interactive flashcard-based Revision Mode.
 */
export const RevisionMode = ({ questions = [], onUpdateQuestion, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  // Track confidence counts for summary screen
  const [stats, setStats] = useState({
    "Don't Know": 0,
    "Need Revision": 0,
    "Comfortable": 0,
    "Strong": 0
  });

  const total = questions.length;
  const currentQuestion = questions[currentIndex];

  const handleConfidenceSelect = (level) => {
    // Increment session stats
    setStats((prev) => ({
      ...prev,
      [level]: prev[level] + 1
    }));

    // Calculate dynamic next revision interval based on confidence level
    const today = new Date();
    let daysToAdd = 1;
    if (level === 'Strong') daysToAdd = 7;
    else if (level === 'Comfortable') daysToAdd = 4;
    else if (level === 'Need Revision') daysToAdd = 1;
    else if (level === "Don't Know") daysToAdd = 1;

    const nextDateObj = new Date(today);
    nextDateObj.setDate(today.getDate() + daysToAdd);
    const nextRevisionStr = nextDateObj.toISOString().split('T')[0];

    // Trigger update callback
    onUpdateQuestion({
      ...currentQuestion,
      confidence: level,
      revisionStatus: 'Revised',
      lastRevised: today.toISOString().split('T')[0],
      nextRevision: nextRevisionStr
    });

    // Check if finished
    if (currentIndex + 1 < total) {
      setCurrentIndex((idx) => idx + 1);
      setShowAnswer(false);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (total === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-12 text-center text-xs space-y-4 max-w-md mx-auto">
        <p className="text-slate-400 font-semibold text-sm">No questions due for revision today.</p>
        <Button onClick={handleClose}>Back to Question Bank</Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs text-sm font-semibold">
      <div className="relative w-full max-w-xl rounded-lg border border-slate-200 bg-white shadow-xl flex flex-col justify-between min-h-[380px] p-6 animate-fade-in-up">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-slate-500">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">Revision Mode</span>
          </div>
          <button onClick={handleClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Card Screen */}
        {!sessionCompleted ? (
          <div className="flex-1 flex flex-col justify-between space-y-6">
            {/* Card Progress */}
            <div>
              <span className="text-xs font-bold text-primary bg-blue-50 border border-blue-200 px-2.5 py-1 rounded uppercase tracking-wider">
                Question {currentIndex + 1} of {total}
              </span>
              
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-4 leading-relaxed font-sans">
                {currentQuestion.question}
              </h3>
              
              <div className="mt-2 text-xs text-slate-500 uppercase tracking-wide">
                Category: <strong className="text-slate-700">{currentQuestion.category}</strong>
                {currentQuestion.topic && ` · Topic: ${currentQuestion.topic}`}
              </div>
            </div>

            {/* Answer Board */}
            <div className="flex-1 flex flex-col justify-center">
              {showAnswer ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 font-medium text-slate-700 text-sm sm:text-base max-h-[160px] overflow-y-auto leading-relaxed whitespace-pre-line border-dashed">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Answer</span>
                  {currentQuestion.answer || 'No detailed answer logged.'}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Button variant="outline" onClick={() => setShowAnswer(true)} className="px-5 shadow-3xs">
                    Show Answer
                  </Button>
                </div>
              )}
            </div>

            {/* Assessment Input Options */}
            {showAnswer && (
              <div className="space-y-3 pt-3 border-t border-slate-100 animate-fade-in">
                <p className="text-xs text-slate-500 text-center font-semibold">How well did you know this?</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs sm:text-sm">
                  <button
                    onClick={() => handleConfidenceSelect("Don't Know")}
                    className="rounded border border-red-200 bg-red-50 py-2.5 text-center font-bold text-red-700 hover:bg-red-100 transition-colors"
                  >
                    Don't Know
                  </button>
                  <button
                    onClick={() => handleConfidenceSelect("Need Revision")}
                    className="rounded border border-orange-200 bg-orange-50 py-2.5 text-center font-bold text-orange-700 hover:bg-orange-100 transition-colors"
                  >
                    Need Revision
                  </button>
                  <button
                    onClick={() => handleConfidenceSelect("Comfortable")}
                    className="rounded border border-blue-200 bg-blue-50 py-2.5 text-center font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    Comfortable
                  </button>
                  <button
                    onClick={() => handleConfidenceSelect("Strong")}
                    className="rounded border border-emerald-200 bg-emerald-50 py-2.5 text-center font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    Strong
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Session Completion Report */
          <div className="flex-1 flex flex-col justify-between space-y-6 text-center">
            <div className="py-4">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-xl font-bold text-slate-900">Revision Complete</h3>
              <p className="text-slate-500 font-semibold mt-1 uppercase tracking-wide text-xs">
                {total} questions reviewed in this session
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full text-xs font-semibold">
              <div className="rounded border border-emerald-150 bg-emerald-50/50 p-2.5 flex justify-between items-center">
                <span className="text-emerald-700">Strong</span>
                <span className="text-emerald-800 text-sm font-bold">{stats.Strong}</span>
              </div>
              <div className="rounded border border-blue-150 bg-blue-50/50 p-2.5 flex justify-between items-center">
                <span className="text-blue-700">Comfortable</span>
                <span className="text-blue-800 text-sm font-bold">{stats.Comfortable}</span>
              </div>
              <div className="rounded border border-orange-150 bg-orange-50/50 p-2.5 flex justify-between items-center">
                <span className="text-orange-700">Need Revision</span>
                <span className="text-orange-850 text-sm font-bold">{stats['Need Revision']}</span>
              </div>
              <div className="rounded border border-red-150 bg-red-50/50 p-2.5 flex justify-between items-center">
                <span className="text-red-700">Don't Know</span>
                <span className="text-red-800 text-sm font-bold">{stats["Don't Know"]}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button onClick={handleClose} className="px-6">
                Back to Question Bank
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default RevisionMode;
