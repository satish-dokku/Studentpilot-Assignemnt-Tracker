import React, { useState } from 'react';
import { Assignment, Subtask } from '../types';
import { Sparkles, X, CheckCircle2, Circle, Clock, Lightbulb, RefreshCw, Plus, Check } from 'lucide-react';

interface AiPlanModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSubtask: (assignmentId: string, subtaskId: string, completed: boolean) => void;
  onRegeneratePlan: (assignment: Assignment) => Promise<void>;
  onAddSubtask: (assignmentId: string, title: string, minutes: number) => void;
  isLoading: boolean;
}

export const AiPlanModal: React.FC<AiPlanModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onUpdateSubtask,
  onRegeneratePlan,
  onAddSubtask,
  isLoading,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskMinutes, setNewSubtaskMinutes] = useState(30);
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  if (!isOpen || !assignment) return null;

  const plan = assignment.aiPlan;
  const subtasks = plan?.subtasks || [];
  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const handleCreateCustomSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    onAddSubtask(assignment.id, newSubtaskTitle.trim(), Number(newSubtaskMinutes) || 30);
    setNewSubtaskTitle('');
    setIsAddingCustom(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">
                <span>{assignment.courseCode}</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="normal-case text-slate-500 dark:text-slate-400">AI Study Schedule</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {assignment.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {isLoading ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-indigo-600/30 border-t-indigo-600 animate-spin" />
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Generating AI Study Schedule...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                  Gemini 3.8 Flash is analyzing the course requirements and breaking down milestones to optimize your study cadence.
                </p>
              </div>
            </div>
          ) : !plan ? (
            /* Zero State: No Plan Generated Yet */
            <div className="py-10 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  No AI Study Plan generated yet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Let Gemini analyze the difficulty, deadline, and scope of this assignment to generate an itemized preparation schedule.
                </p>
              </div>
              <button
                onClick={() => onRegeneratePlan(assignment)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Plan with Gemini 3.8</span>
              </button>
            </div>
          ) : (
            /* Populated Plan View */
            <>
              {/* Strategy Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Study Strategy Overview
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {plan.summary}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Recommended pace: <strong>{plan.recommendedDailyMinutes} mins/day</strong>
                  </span>
                  <span className="font-mono tabular-nums">
                    {completedCount} of {subtasks.length} milestones complete ({progressPercent}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Subtask Milestones List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Milestones & Subtasks
                  </h4>
                  <button
                    onClick={() => setIsAddingCustom(!isAddingCustom)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Step</span>
                  </button>
                </div>

                {isAddingCustom && (
                  <form onSubmit={handleCreateCustomSubtask} className="mb-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Read chapter 4 theorem..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      className="flex-1 text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      autoFocus
                    />
                    <input
                      type="number"
                      min={5}
                      max={360}
                      value={newSubtaskMinutes}
                      onChange={(e) => setNewSubtaskMinutes(Number(e.target.value))}
                      className="w-16 text-xs px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-center font-mono tabular-nums"
                      title="Estimated minutes"
                    />
                    <span className="text-xs text-slate-500 font-mono">min</span>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                )}

                <div className="space-y-2">
                  {subtasks.map((subtask: Subtask, index: number) => {
                    const isDone = subtask.completed;
                    return (
                      <div
                        key={subtask.id || index}
                        onClick={() => onUpdateSubtask(assignment.id, subtask.id, !isDone)}
                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 text-slate-400'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm font-medium ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                            {subtask.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                            <span>Stage: {subtask.stage}</span>
                            <span aria-hidden="true">·</span>
                            <span>~{subtask.estimatedMinutes} mins</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Study Tips Box */}
              {plan.studyTips && plan.studyTips.length > 0 && (
                <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Academic Success Tips</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-amber-900/90 dark:text-amber-200/90 list-disc list-inside">
                    {plan.studyTips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => onRegeneratePlan(assignment)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Regenerate with AI</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
