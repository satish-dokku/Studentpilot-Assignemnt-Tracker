import React from 'react';
import { Assignment } from '../types';
import { getUrgencyInfo, formatDateTime } from '../utils/dateUtils';
import { Sparkles, Check, Clock, Trash2, Edit3, Calendar } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleStatus: (id: string) => void;
  onOpenAiPlan: (assignment: Assignment) => void;
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onToggleStatus,
  onOpenAiPlan,
  onEdit,
  onDelete,
}) => {
  const isCompleted = assignment.status === 'completed';
  const urgency = getUrgencyInfo(assignment.dueDate, isCompleted);

  // Subtask progress calculation
  const totalSubtasks = assignment.aiPlan?.subtasks?.length || 0;
  const completedSubtasks = assignment.aiPlan?.subtasks?.filter((s) => s.completed).length || 0;
  const progressPercent = isCompleted
    ? 100
    : totalSubtasks > 0
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : 0;

  // Priority color styling
  const priorityStyles: Record<Assignment['priority'], { text: string; bg: string }> = {
    urgent: { text: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60' },
    high: { text: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60' },
    medium: { text: 'text-sky-700 dark:text-sky-300', bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60' },
    low: { text: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
  };

  const priorityStyle = priorityStyles[assignment.priority] || priorityStyles.medium;

  return (
    <article className={`group relative bg-white dark:bg-slate-900 border rounded-xl p-5 transition-all duration-200 ${
      isCompleted
        ? 'border-slate-200/60 dark:border-slate-800/60 opacity-80'
        : urgency.isUrgent
        ? 'border-amber-300/80 dark:border-amber-700/60 shadow-xs'
        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
    }`}>
      {/* Header Row: Course & Urgency Badge */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            {assignment.courseCode}
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="truncate max-w-[180px] sm:max-w-xs">{assignment.courseName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Urgency Badge */}
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono tabular-nums ${urgency.badgeClass}`}>
            {urgency.label}
          </span>
          {/* Priority Badge */}
          <span className={`text-xs px-2 py-0.5 rounded-md border font-medium capitalize ${priorityStyle.text} ${priorityStyle.bg}`}>
            {assignment.priority}
          </span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="flex items-start gap-3 mb-3">
        {/* Checkbox toggle button */}
        <button
          onClick={() => onToggleStatus(assignment.id)}
          aria-label={isCompleted ? 'Mark pending' : 'Mark completed'}
          className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600 text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-semibold leading-snug ${
            isCompleted
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-900 dark:text-slate-100'
          }`}>
            {assignment.title}
          </h3>
          {assignment.description && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
              {assignment.description}
            </p>
          )}
        </div>
      </div>

      {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1 font-mono tabular-nums">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {formatDateTime(assignment.dueDate)}
        </span>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
        <span className="flex items-center gap-1 font-mono tabular-nums">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          ~{assignment.estimatedHours}h effort
        </span>
        {totalSubtasks > 0 && (
          <>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <span className="font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-medium">
              {completedSubtasks}/{totalSubtasks} steps done
            </span>
          </>
        )}
      </div>

      {/* Progress Bar (if subtasks exist or completed) */}
      {totalSubtasks > 0 && (
        <div className="mb-4">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-500'
                  : progressPercent > 50
                  ? 'bg-indigo-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-2">
        {/* AI Study Plan Button */}
        <button
          onClick={() => onOpenAiPlan(assignment)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            assignment.aiPlan
              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{assignment.aiPlan ? `View AI Study Plan (${totalSubtasks} steps)` : 'Generate AI Plan'}</span>
        </button>

        {/* Edit & Delete Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(assignment)}
            title="Edit assignment details"
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(assignment.id)}
            title="Delete assignment"
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
