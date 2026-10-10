import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Code, Database, Cpu } from 'lucide-react';

/**
 * Interview Preparation progress component.
 * Calculates dynamic progress from existing question bank data for DSA, CS Fundamentals, and System Design.
 * Typography tuned for comfortable reading and hierarchy.
 */
export const InterviewPreparation = ({ questions = [] }) => {
  const qs = questions || [];
  const totalQuestions = qs.length;

  // Helper to determine if a question is considered prepared/mastered
  const isQuestionMastered = (q) => {
    if (q.revision === true) return true;
    if (q.confidence === 'Strong' || q.confidence === 'Confident') return true;
    if (q.revisionStatus === 'Revised') return true;
    return false;
  };

  // 1. DSA Category
  const dsaQuestions = qs.filter((q) => {
    const s = (q.subject || q.category || '').toUpperCase();
    return s.includes('DSA') || s.includes('ALGORITHM') || s.includes('DATA STRUCTURE');
  });
  const dsaMastered = dsaQuestions.filter(isQuestionMastered).length;
  const dsaTotal = dsaQuestions.length;
  const dsaPct = dsaTotal > 0 ? Math.round((dsaMastered / dsaTotal) * 100) : 0;

  // 2. CS Fundamentals Category (DBMS, CN, OS, OOPS)
  const csQuestions = qs.filter((q) => {
    const s = (q.subject || q.category || '').toUpperCase();
    return (
      s.includes('DBMS') ||
      s.includes('OS') ||
      s.includes('CN') ||
      s.includes('OOPS') ||
      s.includes('NETWORK') ||
      s.includes('OPERATING') ||
      s.includes('DATABASE') ||
      s.includes('FUNDAMENTAL')
    );
  });
  const csMastered = csQuestions.filter(isQuestionMastered).length;
  const csTotal = csQuestions.length;
  const csPct = csTotal > 0 ? Math.round((csMastered / csTotal) * 100) : 0;

  // 3. System Design Category
  const sdQuestions = qs.filter((q) => {
    const s = (q.subject || q.category || '').toUpperCase();
    return s.includes('SYSTEM') || s.includes('DESIGN') || s.includes('ARCHITECTURE');
  });
  const sdMastered = sdQuestions.filter(isQuestionMastered).length;
  const sdTotal = sdQuestions.length;
  const sdPct = sdTotal > 0 ? Math.round((sdMastered / sdTotal) * 100) : 0;

  const categories = [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      shortName: 'DSA & LeetCode Patterns',
      icon: Code,
      mastered: dsaMastered,
      total: dsaTotal,
      percentage: dsaPct,
      color: 'bg-blue-600',
      barColor: 'bg-blue-600',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
    },
    {
      id: 'cs',
      name: 'CS Fundamentals',
      shortName: 'OS, DBMS, Networks, OOPS',
      icon: Database,
      mastered: csMastered,
      total: csTotal,
      percentage: csPct,
      color: 'bg-purple-600',
      barColor: 'bg-purple-600',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
    },
    {
      id: 'sd',
      name: 'System Design',
      shortName: 'High-Level & Low-Level Design',
      icon: Cpu,
      mastered: sdMastered,
      total: sdTotal,
      percentage: sdPct,
      color: 'bg-emerald-600',
      barColor: 'bg-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
    }
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:bg-slate-800/90 dark:border-slate-700/80">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg sm:text-[20px] font-semibold text-slate-900 dark:text-white leading-tight">
            Interview Preparation
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-normal">
            Progress across core placement interview topics
          </p>
        </div>
        <Link
          to="/questions"
          className="text-sm font-semibold text-primary hover:text-primary-dark dark:text-blue-400 flex items-center space-x-1.5 transition-colors"
        >
          <span>Go to Question Bank</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="pt-5 sm:pt-6">
        {totalQuestions === 0 ? (
          <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
            <div className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100 dark:border-slate-700">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
              No preparation data yet
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              Add questions to your Question Bank to monitor your interview preparation progress.
            </p>
            <div className="mt-4.5">
              <Link
                to="/questions"
                className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <span>Go to Question Bank →</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="rounded-lg border border-slate-150/80 bg-slate-50/50 p-4.5 transition-all hover:bg-white hover:border-slate-300 hover:shadow-xs dark:bg-slate-900/30 dark:border-slate-700/60 dark:hover:bg-slate-800/80 dark:hover:border-slate-600"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.iconBg} shrink-0`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          {cat.name}
                        </h4>
                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
                          {cat.shortName}
                        </span>
                      </div>
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-none">
                      {cat.percentage}%
                    </span>
                  </div>

                  {/* Clean progress bar */}
                  <div className="mt-4">
                    <div className="h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden">
                      <div
                        className={`h-full ${cat.barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Subtext info */}
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-medium">
                      {cat.mastered} of {cat.total} mastered
                    </span>
                    <Link
                      to="/questions"
                      className="text-primary hover:underline dark:text-blue-400 font-semibold text-xs sm:text-sm"
                    >
                      Practice →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPreparation;
