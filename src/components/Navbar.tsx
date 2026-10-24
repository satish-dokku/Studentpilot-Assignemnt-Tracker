import React from 'react';
import { Plus, GraduationCap, FileText, RotateCcw } from 'lucide-react';

interface NavbarProps {
  onOpenNewModal: () => void;
  onOpenReportModal: () => void;
  onLoadDemoData: () => void;
  assignmentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewModal,
  onOpenReportModal,
  onLoadDemoData,
  assignmentCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap">
              Student Assignment Tracker
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Academic Semester Hub
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Academic Utilities */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Project Report & Viva Spec</span>
          </button>
          <button
            onClick={onLoadDemoData}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap cursor-pointer text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300"
            title="Preload realistic semester assignments for testing"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Load Demo Data</span>
          </button>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {assignmentCount} {assignmentCount === 1 ? 'task' : 'tasks'} enrolled
          </span>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </div>
      </div>
    </header>
  );
};
