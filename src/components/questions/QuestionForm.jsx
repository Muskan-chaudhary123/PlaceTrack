import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * Modal form to add or edit question bank entries, supporting custom columns dynamically.
 */
export const QuestionForm = ({
  question,
  subjects = ['DSA', 'DBMS', 'CN', 'OS', 'OOPS'],
  topics = {},
  customColumns = [],
  initialSubject = 'DSA',
  initialTopic = '',
  onClose,
  onSubmit
}) => {
  const isEdit = !!question;

  const [subject, setSubject] = useState(initialSubject);
  const [topic, setTopic] = useState(initialTopic);
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [revision, setRevision] = useState(false);
  const [revisit, setRevisit] = useState(false);
  const [customValues, setCustomValues] = useState({});
  
  // Secondary metadata details
  const [answer, setAnswer] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [errors, setErrors] = useState({});

  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Sync state if editing
  useEffect(() => {
    if (question) {
      setSubject(question.subject || 'DSA');
      setTopic(question.topic || '');
      setQuestionText(question.question || '');
      setDifficulty(question.difficulty || 'Medium');
      setRevision(!!question.revision);
      setRevisit(!!question.revisit);
      setCustomValues(question.customValues || {});
      setAnswer(question.answer || '');
      setQuickNote(question.quickNote || '');
    } else {
      setSubject(initialSubject || 'DSA');
      setTopic(initialTopic || '');
    }
  }, [question, initialSubject, initialTopic]);

  const handleCustomValueChange = (colName, value) => {
    setCustomValues((prev) => ({ ...prev, [colName]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!questionText.trim()) {
      newErrors.question = 'Question text is required.';
    }
    if (!subject) {
      newErrors.subject = 'Subject is required.';
    }
    if (!topic) {
      newErrors.topic = 'Topic is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: isEdit ? question.id : undefined,
      subject,
      topic,
      question: questionText.trim(),
      difficulty,
      revision,
      revisit,
      customValues,
      answer: answer.trim(),
      quickNote: quickNote.trim(),
      createdAt: isEdit ? question.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  // Get topics list for selected subject
  const currentTopics = topics[subject] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />

      <div className="relative z-10 w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-lg animate-fade-in-up dark:bg-slate-800 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 px-6 py-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {isEdit ? 'Edit Question' : 'Add Question'}
          </h3>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto px-6 py-5 space-y-4 text-sm">
            
            {/* Subject & Topic Selectors */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject <span className="text-red-500">*</span></label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    // Reset topic if changing subject
                    const newTopics = topics[e.target.value] || [];
                    setTopic(newTopics[0] || '');
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic <span className="text-red-500">*</span></label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {currentTopics.length === 0 ? (
                    <option value="">No topics yet</option>
                  ) : (
                    currentTopics.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows="2"
                className={`w-full rounded-md border px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 ${
                  errors.question ? 'border-red-350 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'
                }`}
                placeholder="e.g. Find two numbers that add up to a specific target."
              />
              {errors.question && <span className="text-[10px] text-red-500 mt-1 block">{errors.question}</span>}
            </div>

            {/* Difficulty, Revision, Revisit */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {difficulties.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center font-semibold text-slate-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={revision}
                    onChange={(e) => setRevision(e.target.checked)}
                    className="h-4.5 w-4.5 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <span className="ml-2">Revision Needed</span>
                </label>
              </div>

              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center font-semibold text-slate-700 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={revisit}
                    onChange={(e) => setRevisit(e.target.checked)}
                    className="h-4.5 w-4.5 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <span className="ml-2">Revisit Scheduled</span>
                </label>
              </div>
            </div>

            {/* Answer Text Area */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Explanation / Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows="3"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Explain key logic steps, algorithm properties..."
              />
            </div>

            {/* Quick Note */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quick Revision Note</label>
              <input
                type="text"
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Key things to remember (e.g. O(1) space constraints)"
              />
            </div>

            {/* DYNAMIC CUSTOM COLUMNS FIELDS */}
            {customColumns && customColumns.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">Custom Fields</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {customColumns.map((col) => {
                    const val = customValues[col.name] !== undefined ? customValues[col.name] : (col.type === 'Checkbox' ? false : '');
                    return (
                      <div key={col.name} className="flex flex-col">
                        <label className="block font-semibold text-slate-700 mb-1">{col.name}</label>
                        {col.type === 'Checkbox' ? (
                          <div className="flex items-center h-9">
                            <input
                              type="checkbox"
                              checked={!!val}
                              onChange={(e) => handleCustomValueChange(col.name, e.target.checked)}
                              className="h-4.5 w-4.5 text-primary rounded border-slate-300 focus:ring-primary"
                            />
                            <span className="ml-2 text-slate-500 font-medium">Yes</span>
                          </div>
                        ) : col.type === 'Date' ? (
                          <input
                            type="date"
                            value={val}
                            onChange={(e) => handleCustomValueChange(col.name, e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          <input
                            type={col.type === 'Link' ? 'url' : 'text'}
                            value={val}
                            onChange={(e) => handleCustomValueChange(col.name, e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder={`Enter ${col.name.toLowerCase()}...`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 bg-slate-50 px-6 py-4 rounded-b-lg">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Save Changes' : 'Add Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default QuestionForm;
