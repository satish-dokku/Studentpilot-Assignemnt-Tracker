import React, { useState, useEffect } from 'react';
import { Assignment, PriorityLevel } from '../types';
import { X, Sparkles, Calendar, BookOpen, Clock, AlertTriangle } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Partial<Assignment>, generateAiPlanImmediately: boolean) => void;
  editingAssignment?: Assignment | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAssignment,
}) => {
  const [title, setTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [description, setDescription] = useState('');
  const [autoGenerateAi, setAutoGenerateAi] = useState(true);

  // Set default due date to 3 days from now
  const getDefaultDueDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (editingAssignment) {
      setTitle(editingAssignment.title);
      setCourseCode(editingAssignment.courseCode);
      setCourseName(editingAssignment.courseName);
      setDueDate(editingAssignment.dueDate?.slice(0, 16) || getDefaultDueDate());
      setPriority(editingAssignment.priority);
      setEstimatedHours(editingAssignment.estimatedHours || 4);
      setDescription(editingAssignment.description || '');
      setAutoGenerateAi(false);
    } else {
      setTitle('');
      setCourseCode('');
      setCourseName('');
      setDueDate(getDefaultDueDate());
      setPriority('medium');
      setEstimatedHours(4);
      setDescription('');
      setAutoGenerateAi(true);
    }
  }, [editingAssignment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !courseCode.trim()) return;

    onSave(
      {
        title: title.trim(),
        courseCode: courseCode.trim().toUpperCase(),
        courseName: courseName.trim() || courseCode.trim().toUpperCase(),
        dueDate,
        priority,
        estimatedHours: Number(estimatedHours) || 4,
        description: description.trim(),
        status: editingAssignment ? editingAssignment.status : 'pending',
      },
      !editingAssignment && autoGenerateAi
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Assignment Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Consensus Lab 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Course Code & Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS301"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full text-sm px-3 py-2 font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
                Course Name
              </label>
              <input
                type="text"
                placeholder="e.g. Operating Systems"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Due Date & Estimated Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Due Date & Time *</span>
              </label>
              <input
                type="datetime-local"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm px-3 py-2 font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Est. Effort (Hours)</span>
              </label>
              <input
                type="number"
                min={0.5}
                max={100}
                step={0.5}
                required
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
              <span>Priority Rating</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'urgent'] as PriorityLevel[]).map((p) => {
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 text-xs font-medium rounded-lg capitalize border transition-all cursor-pointer ${
                      isSelected
                        ? p === 'urgent'
                          ? 'bg-rose-50 border-rose-500 text-rose-700 font-semibold'
                          : p === 'high'
                          ? 'bg-amber-50 border-amber-500 text-amber-700 font-semibold'
                          : p === 'medium'
                          ? 'bg-sky-50 border-sky-500 text-sky-700 font-semibold'
                          : 'bg-slate-100 border-slate-500 text-slate-800 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
              Requirements & Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste rubric guidelines, submission requirements, or specific tools needed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Auto-generate AI plan checkbox (new assignment only) */}
          {!editingAssignment && (
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 cursor-pointer">
              <input
                type="checkbox"
                checked={autoGenerateAi}
                onChange={(e) => setAutoGenerateAi(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
              />
              <div className="flex-1 text-xs">
                <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Auto-generate AI Study Schedule with Gemini
                </span>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  Creates milestone subtasks and estimated daily study chunks upon saving.
                </p>
              </div>
            </label>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {editingAssignment ? 'Save Changes' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
