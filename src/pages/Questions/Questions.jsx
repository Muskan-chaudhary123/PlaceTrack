import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, HelpCircle } from 'lucide-react';
import { QuestionFilters } from '../../components/questions/QuestionFilters';
import { QuestionTable } from '../../components/questions/QuestionTable';
import { QuestionForm } from '../../components/questions/QuestionForm';
import { questionsApi } from '../../api/questions';
import { Toast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

export const Questions = () => {
  const navigate = useNavigate();


  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState(['DSA', 'DBMS', 'CN', 'OS', 'OOPS']);
  const [topics, setTopics] = useState({
    DSA: ['Arrays', 'Trees', 'Graphs', 'DP'],
    DBMS: ['Normalization', 'SQL Querying', 'Transactions'],
    CN: ['IP Addressing', 'TCP/IP Layers', 'Routing Protocols'],
    OS: ['CPU Scheduling', 'Process Synchronization', 'Virtual Memory'],
    OOPS: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction']
  });
  const [customColumns, setCustomColumns] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState('DSA');
  const [selectedTopic, setSelectedTopic] = useState('Arrays');

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [revisionFilter, setRevisionFilter] = useState('All');
  const [revisitFilter, setRevisitFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsRes, questionsRes] = await Promise.all([
        questionsApi.getSettings(),
        questionsApi.getQuestions()
      ]);

      if (settingsRes && settingsRes.success) {
        const data = settingsRes.data;
        if (data.subjects && data.subjects.length > 0) {
          setSubjects(data.subjects);
        }
        if (data.topics) {
          setTopics(data.topics);
        }
        if (data.customColumns) {
          setCustomColumns(data.customColumns);
        }
      }

      if (questionsRes && questionsRes.success) {
        setQuestions(questionsRes.data);
      }
    } catch (e) {
      console.error('Failed to load Question Bank data:', e);
      triggerToast('Failed to load data from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const currentTopics = topics[selectedSubject] || [];
    if (currentTopics.length > 0) {

      if (!currentTopics.includes(selectedTopic)) {
        setSelectedTopic(currentTopics[0]);
      }
    } else {
      setSelectedTopic('');
    }
  }, [selectedSubject, topics]);

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSaveSettings = async (newSubjects, newTopics, newCols) => {
    try {
      const res = await questionsApi.saveSettings({
        subjects: newSubjects,
        topics: newTopics,
        customColumns: newCols
      });
      if (res && res.success) {
        setSubjects(res.data.subjects);
        setTopics(res.data.topics);
        setCustomColumns(res.data.customColumns);
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
      triggerToast('Failed to sync settings with server.', 'error');
    }
  };

  const handleAddSubject = () => {
    const name = prompt('Enter new Subject name:');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    if (subjects.includes(trimmed)) {
      triggerToast('Subject already exists.', 'info');
      return;
    }
    const updatedSubjects = [...subjects, trimmed];
    const updatedTopics = { ...topics, [trimmed]: [] };
    setSubjects(updatedSubjects);
    setTopics(updatedTopics);
    setSelectedSubject(trimmed);
    setSelectedTopic('');
    handleSaveSettings(updatedSubjects, updatedTopics, customColumns);
    triggerToast(`Subject "${trimmed}" added.`);
  };

  const handleAddTopic = () => {
    if (!selectedSubject) return;
    const name = prompt(`Enter new Topic name for ${selectedSubject}:`);
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const currentTopics = topics[selectedSubject] || [];
    if (currentTopics.includes(trimmed)) {
      triggerToast('Topic already exists.', 'info');
      return;
    }
    const updatedTopics = {
      ...topics,
      [selectedSubject]: [...currentTopics, trimmed]
    };
    setTopics(updatedTopics);
    setSelectedTopic(trimmed);
    handleSaveSettings(subjects, updatedTopics, customColumns);
    triggerToast(`Topic "${trimmed}" added to ${selectedSubject}.`);
  };

  const handleAddColumn = () => {
    const name = prompt('Enter Custom Column Name:');
    if (!name || !name.trim()) return;
    const trimmedName = name.trim();

    const reserved = ['Question', 'Difficulty', 'Revision', 'Revisit'];
    if (reserved.includes(trimmedName) || customColumns.some((c) => c.name === trimmedName)) {
      triggerToast('Column name is reserved or already exists.', 'info');
      return;
    }

    const type = prompt('Enter Column Type (Text, Checkbox, Date, Link):', 'Text');
    if (!type) return;
    const normalizedType = type.trim();
    if (!['Text', 'Checkbox', 'Date', 'Link'].includes(normalizedType)) {
      triggerToast('Invalid type. Choose from: Text, Checkbox, Date, Link.', 'error');
      return;
    }

    const updatedCols = [...customColumns, { name: trimmedName, type: normalizedType }];
    setCustomColumns(updatedCols);
    handleSaveSettings(subjects, topics, updatedCols);
    triggerToast(`Custom column "${trimmedName}" (${normalizedType}) created.`);
  };

  const handleRemoveColumn = (colName) => {
    if (!confirm(`Are you sure you want to remove the custom column "${colName}"?`)) return;
    const updatedCols = customColumns.filter((c) => c.name !== colName);
    setCustomColumns(updatedCols);
    handleSaveSettings(subjects, topics, updatedCols);
    triggerToast(`Column "${colName}" removed.`);
  };

  const handleAddQuestionSubmit = async (newQ) => {
    try {
      const payload = {
        ...newQ,
        subject: selectedSubject,
        topic: selectedTopic
      };
      const res = await questionsApi.createQuestion(payload);
      if (res && res.success) {
        setQuestions((prev) => [res.data, ...prev]);
        setShowAddModal(false);
        triggerToast('Question added successfully.');
      }
    } catch (e) {
      console.error(e);
      triggerToast('Failed to create question.', 'error');
    }
  };

  const handleUpdateQuestionSubmit = async (updatedQ) => {
    try {
      const res = await questionsApi.updateQuestion(updatedQ.id, updatedQ);
      if (res && res.success) {
        setQuestions((prev) => prev.map((q) => (q.id === updatedQ.id ? res.data : q)));
        setEditingQuestion(null);
        triggerToast('Question updated successfully.');
      }
    } catch (e) {
      console.error(e);
      triggerToast('Failed to update question.', 'error');
    }
  };

  const handleDeleteSubmit = async () => {
    if (!showDeleteConfirmId) return;
    try {
      const res = await questionsApi.deleteQuestion(showDeleteConfirmId);
      if (res && res.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== showDeleteConfirmId));
        setShowDeleteConfirmId(null);
        triggerToast('Question deleted.', 'info');
      }
    } catch (e) {
      console.error(e);
      triggerToast('Failed to delete question.', 'error');
    }
  };

  const handleToggleField = async (qId, field) => {
    const question = questions.find((q) => q.id === qId);
    if (!question) return;

    try {
      const newVal = !question[field];
      const res = await questionsApi.updateQuestion(qId, { [field]: newVal });
      if (res && res.success) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === qId ? { ...q, [field]: newVal } : q))
        );
        triggerToast(`Updated ${field} status.`, 'success');
      }
    } catch (e) {
      console.error(`Failed to toggle ${field}:`, e);
      triggerToast('Failed to update status on server.', 'error');
    }
  };


  const getFilteredAndSorted = () => {
    let result = questions.filter(
      (q) => q.subject === selectedSubject && q.topic === selectedTopic
    );

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (q) =>
          q.question.toLowerCase().includes(query) ||
          (q.topic && q.topic.toLowerCase().includes(query))
      );
    }

    if (difficulty !== 'All') {
      result = result.filter((q) => q.difficulty === difficulty);
    }

    if (revisionFilter !== 'All') {
      const showRev = revisionFilter === 'Yes';
      result = result.filter((q) => !!q.revision === showRev);
    }

    if (revisitFilter !== 'All') {
      const showRevisit = revisitFilter === 'Yes';
      result = result.filter((q) => !!q.revisit === showRevisit);
    }

    return result;
  };

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="mt-3 text-slate-500 font-semibold text-xs dark:text-slate-400">Loading Question Bank...</span>
      </div>
    );
  }

  const currentSubjTopics = topics[selectedSubject] || [];
  const filteredQuestions = getFilteredAndSorted();

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            Question Bank
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1.5 font-normal">
            Organize practice concepts, difficulty levels, and revisit schedules.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleAddColumn}
            variant="outline"
            className="text-sm sm:text-base py-2.5 px-4 flex items-center justify-center space-x-1.5 font-medium shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Column</span>
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="text-sm sm:text-base py-2.5 px-4 flex items-center justify-center space-x-1.5 font-medium shadow-xs"
            disabled={currentSubjTopics.length === 0}
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => setSelectedSubject(subj)}
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
              selectedSubject === subj
                ? 'bg-primary text-white shadow-3xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {subj}
          </button>
        ))}
        <button
          onClick={handleAddSubject}
          type="button"
          className="px-3 py-2 text-xs font-bold rounded-md border border-dashed border-slate-300 hover:border-slate-400 text-slate-500 hover:text-slate-700 flex items-center space-x-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Subject</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2">Topics:</span>
        {currentSubjTopics.map((topicItem) => (
          <button
            key={topicItem}
            onClick={() => setSelectedTopic(topicItem)}
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
              selectedTopic === topicItem
                ? 'bg-blue-50 text-primary border border-primary/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {topicItem}
          </button>
        ))}
        <button
          onClick={handleAddTopic}
          type="button"
          className="px-3 py-1.5 text-xs font-semibold rounded-full border border-dashed border-slate-350 hover:border-slate-450 text-slate-500 hover:text-slate-700 flex items-center space-x-1"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Topic</span>
        </button>
      </div>

      {currentSubjTopics.length > 0 && (
        <QuestionFilters
          search={search}
          onSearchChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          revision={revisionFilter}
          onRevisionChange={setRevisionFilter}
          revisit={revisitFilter}
          onRevisitChange={setRevisitFilter}
        />
      )}

      {currentSubjTopics.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-lg p-6 max-w-sm mx-auto my-6 text-xs">
          <span className="text-4xl block mb-2">📁</span>
          <h4 className="font-bold text-slate-800">No topics yet</h4>
          <p className="text-slate-400 font-semibold mt-1 mb-4">Add your first topic to start organizing questions.</p>
          <Button onClick={handleAddTopic} size="sm">Add Topic</Button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 border-dashed rounded-lg p-6 max-w-sm mx-auto my-6 text-xs">
          <span className="text-4xl block mb-2">💡</span>
          <h4 className="font-bold text-slate-800">No questions in this topic yet</h4>
          <p className="text-slate-400 font-semibold mt-1 mb-4">Add your first practice question to this topic.</p>
          <div className="flex justify-center space-x-2">
            <Button onClick={() => setShowAddModal(true)} size="sm">Add Question</Button>
            <Button onClick={handleAddColumn} variant="outline" size="sm">Add Column</Button>
          </div>
        </div>
      ) : (
        <QuestionTable
          questions={filteredQuestions}
          customColumns={customColumns}
          onView={(id) => navigate(`/questions/${id}`)}
          onEdit={setEditingQuestion}
          onDelete={setShowDeleteConfirmId}
          onToggleField={handleToggleField}
          onRemoveColumn={handleRemoveColumn}
        />
      )}

      {showAddModal && (
        <QuestionForm
          subjects={subjects}
          topics={topics}
          customColumns={customColumns}
          initialSubject={selectedSubject}
          initialTopic={selectedTopic}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddQuestionSubmit}
        />
      )}

      {editingQuestion && (
        <QuestionForm
          question={editingQuestion}
          subjects={subjects}
          topics={topics}
          customColumns={customColumns}
          onClose={() => setEditingQuestion(null)}
          onSubmit={handleUpdateQuestionSubmit}
        />
      )}

      {showDeleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirmId(null)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-lg text-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-2">Delete Question?</h4>
            <p className="text-slate-500 mb-6 font-medium leading-normal">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirmId(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteSubmit} className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100">Delete</Button>
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
export default Questions;
