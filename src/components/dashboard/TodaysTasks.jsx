import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CheckSquare, Plus, ArrowRight } from 'lucide-react';

/**
 * Today's Tasks component.
 * Displays interactive checklist of pending tasks with comfortable typography and inline task management.
 */
export const TodaysTasks = ({
  tasks = [],
  onToggleTask,
  onAddTask
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    if (onAddTask) {
      onAddTask(newTitle.trim());
    }
    setNewTitle('');
    setIsAdding(false);
  };

  const pendingCount = tasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80 flex flex-col justify-between h-full">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="flex items-center space-x-2.5">
            <h3 className="text-lg sm:text-[20px] font-semibold text-slate-900 dark:text-white leading-tight">
              Today's Tasks
            </h3>
            {tasks.length > 0 && (
              <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Your action items and daily preparation
          </p>
        </div>
        <Link
          to="/calendar"
          className="text-sm font-semibold text-primary hover:text-primary-dark dark:text-blue-400 flex items-center space-x-1.5 transition-colors"
        >
          <span>Calendar</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="py-3 flex-1 flex flex-col justify-center">
        {tasks.length === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100 dark:border-slate-700">
              <CheckSquare className="h-5.5 w-5.5" />
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No tasks for today
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              You're all caught up! Add a new task to keep your preparation on track.
            </p>
            {!isAdding ? (
              <div className="mt-4.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  <span>Add Task</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.slice(0, 5).map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  onClick={() => onToggleTask && onToggleTask(task.id)}
                  className={`group flex items-start space-x-3 rounded-lg border p-3 transition-all cursor-pointer select-none ${
                    isCompleted
                      ? 'border-slate-150 bg-slate-50/40 text-slate-400 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-500'
                      : 'border-slate-150/80 bg-slate-50/50 text-slate-800 hover:border-slate-300 hover:bg-white dark:border-slate-700/60 dark:bg-slate-900/30 dark:text-slate-200 dark:hover:bg-slate-800/80 dark:hover:border-slate-600'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Toggle task ${task.title}`}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : 'border border-slate-300 bg-white group-hover:border-primary dark:border-slate-600 dark:bg-slate-800'
                    }`}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm sm:text-[15px] font-medium leading-snug ${
                        isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.type && (
                      <span className="inline-block text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal">
                        {task.type}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick inline task creation form */}
        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-3.5">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter task description..."
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-slate-900 dark:border-slate-700 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewTitle('');
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          tasks.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center space-x-1.5 text-sm font-medium text-primary hover:text-primary-dark dark:text-blue-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add task</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TodaysTasks;
