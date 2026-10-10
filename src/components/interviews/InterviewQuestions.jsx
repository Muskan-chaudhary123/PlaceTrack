import React, { useState } from 'react';
import { Plus, X, Edit, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Question tracker rendering interview questions with difficulty levels, categories, answers, and performances.
 */
export const InterviewQuestions = ({ questions = [], onQuestionsChange, onAddToQuestionBank }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Medium');
  const [myAnswer, setMyAnswer] = useState('');
  const [performance, setPerformance] = useState('Good');

  const categories = [
    'DSA', 'DBMS', 'OS', 'OOP', 'Computer Networks', 'System Design',
    'Python', 'JavaScript', 'Django', 'SQL', 'HR', 'Behavioral', 'Other'
  ];

  const resetForm = () => {
    setQuestionText('');
    setCategory('DSA');
    setDifficulty('Medium');
    setMyAnswer('');
    setPerformance('Good');
    setEditingQuestion(null);
    setShowForm(false);
  };

  const handleEditClick = (q) => {
    setEditingQuestion(q);
    setQuestionText(q.question);
    setCategory(q.category);
    setDifficulty(q.difficulty);
    setMyAnswer(q.myAnswer || '');
    setPerformance(q.performance);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    let updatedQuestions;
    if (editingQuestion) {
      // Edit existing
      updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id
          ? { ...q, question: questionText, category, difficulty, myAnswer, performance }
          : q
      );
    } else {
      // Add new
      const newQ = {
        id: `q-${Math.random().toString(36).substring(2, 9)}`,
        question: questionText,
        category,
        difficulty,
        myAnswer,
        performance
      };
      updatedQuestions = [...questions, newQ];
    }

    onQuestionsChange(updatedQuestions);
    resetForm();
  };

  const handleDelete = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    onQuestionsChange(updated);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-250',
    Hard: 'bg-red-50 text-red-700 border-red-200'
  };

  const perfColors = {
    'Needs Improvement': 'bg-red-50 text-red-600',
    Average: 'bg-slate-100 text-slate-600',
    Good: 'bg-blue-50 text-primary',
    Excellent: 'bg-emerald-50 text-emerald-600'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Questions Asked</h3>
          <p className="text-xs text-slate-500 font-medium">Review and practice questions asked in this round</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="text-sm py-1.5 px-3 flex items-center space-x-1.5"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </Button>
      </div>

      {/* List of Questions */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-10 rounded border border-dashed border-slate-150 bg-slate-50/50">
            <span className="text-slate-500 font-medium">No questions logged yet. Click "+ Add Question" to document technical concepts.</span>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="rounded-lg border border-slate-150 bg-slate-50/30 p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-slate-900 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs uppercase tracking-wide">
                      {q.category}
                    </span>
                    <span className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${difficultyColors[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${perfColors[q.performance]}`}>
                      Perf: {q.performance}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base pt-1 leading-normal">
                    {q.question}
                  </h4>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => onAddToQuestionBank && onAddToQuestionBank(q)}
                    type="button"
                    className="p-1.5 rounded text-slate-400 hover:text-primary hover:bg-slate-100"
                    title="Add to Question Bank"
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditClick(q)}
                    type="button"
                    className="p-1.5 rounded text-slate-400 hover:text-slate-655 hover:bg-slate-100"
                    title="Edit Question"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    type="button"
                    className="p-1.5 rounded text-slate-400 hover:text-red-655 hover:bg-red-50"
                    title="Delete Question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {q.myAnswer && (
                <div className="rounded border border-slate-200 bg-white p-3.5">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    My Answer / Experience
                  </span>
                  <p className="text-slate-700 text-sm sm:text-base font-normal whitespace-pre-wrap leading-relaxed">
                    {q.myAnswer}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal overlay form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={resetForm} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          
          <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900">
                {editingQuestion ? 'Edit Question' : 'Add Question'}
              </h4>
              <button onClick={resetForm} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="px-5 py-4 space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Question <span className="text-red-500">*</span></label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    required
                    rows="3"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                    placeholder="e.g. Explain database indexing."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">My Performance</label>
                    <select
                      value={performance}
                      onChange={(e) => setPerformance(e.target.value)}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="Needs Improvement">Needs Improvement</option>
                      <option value="Average">Average</option>
                      <option value="Good">Good</option>
                      <option value="Excellent">Excellent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">My Answer / Key Notes</label>
                  <textarea
                    value={myAnswer}
                    onChange={(e) => setMyAnswer(e.target.value)}
                    rows="3"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                    placeholder="Brief summary of how you answered, or ideal response details..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 border-t border-slate-100 bg-slate-50 px-5 py-3 rounded-b-lg">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuestion ? 'Save Changes' : 'Add Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default InterviewQuestions;
