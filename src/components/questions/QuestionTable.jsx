import React from 'react';
import { Edit, Trash2, Calendar, Link as LinkIcon } from 'lucide-react';
import { formatDate } from '../applications/ApplicationCard';

/**
 * Redesigned desktop-friendly table of questions.
 * Supports custom columns and inline checkbox/state toggles.
 */
export const QuestionTable = ({
  questions = [],
  customColumns = [],
  onView,
  onEdit,
  onDelete,
  onToggleField,
  onRemoveColumn
}) => {
  const difficultyColors = {
    Easy: 'text-emerald-600 font-semibold',
    Medium: 'text-amber-600 font-semibold',
    Hard: 'text-red-600 font-semibold'
  };

  const renderToggleControl = (val, onClick) => {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`flex items-center justify-center h-6 w-6 rounded-full border transition-all ${
          val
            ? 'bg-blue-50 border-primary text-primary font-bold text-xs'
            : 'bg-white border-slate-300 text-slate-350 hover:border-slate-400 hover:bg-slate-50'
        }`}
      >
        {val ? '✓' : '○'}
      </button>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-3xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            <th className="px-5 py-3.5 w-1/3">Question</th>
            <th className="px-4 py-3.5">Difficulty</th>
            <th className="px-4 py-3.5 text-center">Revision</th>
            <th className="px-4 py-3.5 text-center">Revisit</th>
            {customColumns.map((col) => (
              <th key={col.name} className="px-4 py-3.5 relative group min-w-[120px]">
                <span className="mr-4">{col.name}</span>
                <button
                  onClick={() => onRemoveColumn(col.name)}
                  type="button"
                  className="absolute right-2 top-3 text-[9px] text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase"
                  title="Remove Column"
                >
                  Delete
                </button>
              </th>
            ))}
            <th className="px-5 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
              {/* Question Title & Topic */}
              <td className="px-5 py-4">
                <div className="max-w-md">
                  <span
                    onClick={() => onView(q.id)}
                    className="block font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer line-clamp-2 leading-relaxed"
                  >
                    {q.question}
                  </span>
                  {q.topic && (
                    <span className="inline-block bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 text-[9px] mt-1.5">
                      {q.topic}
                    </span>
                  )}
                </div>
              </td>

              {/* Difficulty */}
              <td className="px-4 py-4">
                <span className={difficultyColors[q.difficulty] || 'text-slate-650'}>
                  {q.difficulty}
                </span>
              </td>

              {/* Revision toggle */}
              <td className="px-4 py-4 text-center">
                <div className="flex justify-center">
                  {renderToggleControl(q.revision, () => onToggleField(q.id, 'revision'))}
                </div>
              </td>

              {/* Revisit toggle */}
              <td className="px-4 py-4 text-center">
                <div className="flex justify-center">
                  {renderToggleControl(q.revisit, () => onToggleField(q.id, 'revisit'))}
                </div>
              </td>

              {/* Dynamic custom columns */}
              {customColumns.map((col) => {
                const val = q.customValues?.[col.name];
                return (
                  <td key={col.name} className="px-4 py-4 font-semibold text-slate-800">
                    {col.type === 'Checkbox' ? (
                      <input
                        type="checkbox"
                        checked={!!val}
                        disabled
                        className="h-4.5 w-4.5 text-primary rounded border-slate-300"
                      />
                    ) : col.type === 'Link' ? (
                      val ? (
                        <a
                          href={val}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center space-x-1"
                        >
                          <LinkIcon className="h-3 w-3 shrink-0" />
                          <span>Open</span>
                        </a>
                      ) : '-'
                    ) : col.type === 'Date' ? (
                      val ? (
                        val.includes('-') 
                          ? `${val.split('-')[2]}/${val.split('-')[1]}/${val.split('-')[0]}` 
                          : new Date(val).toLocaleDateString('en-GB')
                      ) : '-'
                    ) : (
                      val || '-'
                    )}
                  </td>
                );
              })}

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="flex items-center justify-end space-x-2.5">
                  <button
                    onClick={() => onEdit(q)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-655 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default QuestionTable;
