import React from 'react';
import { SemesterStats } from '../types';
import { BookOpen, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface StatsBarProps {
  stats: SemesterStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Enrolled */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Total Coursework
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
              {stats.total}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ~{stats.totalEstimatedHours}h effort
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Urgent / Due Soon */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Due Soon (≤48h)
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${stats.dueSoon > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-slate-50'}`}>
              {stats.dueSoon}
            </span>
            {stats.overdue > 0 && (
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold font-mono tabular-nums">
                ({stats.overdue} overdue)
              </span>
            )}
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Pending Queue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Pending Tasks
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-50">
              {stats.pending}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              in queue
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Completed Rate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Completed Submissions
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              ({stats.completionRate}% rate)
            </span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};
