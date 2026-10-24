import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2, Layers, ShieldAlert, Cpu } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'architecture' | 'scope' | 'viva'>('problem');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
                University Examination Documentation
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Student Assignment & Deadline Tracker
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 sm:px-6 gap-2 bg-slate-50/20">
          {[
            { id: 'problem', label: '1. Problem & Objectives' },
            { id: 'architecture', label: '2. Architecture & AI' },
            { id: 'scope', label: '3. Scope & Limitations' },
            { id: 'viva', label: '4. Viva Defense Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeTab === 'problem' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Real-World Academic Problem
                </h3>
                <p>
                  Modern university students handle multiple simultaneous subjects with overlapping deadlines, varying credit hours, and complex grading criteria. Key challenges identified include:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong>Cognitive Fragmentation:</strong> Deadlines spread across multiple syllabi and portals.</li>
                  <li><strong>Urgency Miscalculation:</strong> Students tend to prioritize easier tasks over high-effort assignments due soon.</li>
                  <li><strong>The Blank Page Obstacle:</strong> Large multi-part assignments lack intermediate actionable milestones.</li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Project Objectives
                </h3>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  <li>Centralize semester assignments into a single responsive dashboard.</li>
                  <li>Compute live urgency states (Overdue, Due Soon, Due Tomorrow, Upcoming) with tabular countdowns.</li>
                  <li>Automate task decomposition via Gemini 3.8 Flash into concrete milestone subtasks with time estimates.</li>
                  <li>Ensure zero-latency evaluation reliability using client-side localStorage and heuristic offline fallbacks.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  Technical Stack & System Design
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-semibold block text-slate-900 dark:text-slate-100 mb-1">Frontend Layer</span>
                    React 19, TypeScript, Tailwind CSS, Lucide icons, responsive CSS grid.
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-semibold block text-slate-900 dark:text-slate-100 mb-1">Backend & AI Layer</span>
                    Node.js Express proxy, @google/genai SDK, Gemini 3.8 Flash, strict JSON schemas.
                  </div>
                </div>
                <p>
                  <strong>Security Pattern:</strong> The Gemini API key remains strictly encapsulated in the server-side environment (`server.ts`). The React browser client interacts only with the internal `/api/ai/plan` proxy endpoint.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">AI Prompt Strategy & Fallback Reliability</h4>
                <p>
                  The system passes the assignment title, course, deadline, and hours estimate to Gemini with structured output validation (`responseSchema`). If API quotas or network drops occur, an academic heuristic generator seamlessly produces realistic milestone plans so the application never fails.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'scope' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  Prototype Scope vs. Limitations
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg">
                    <strong className="text-emerald-800 dark:text-emerald-300 block mb-1">Delivered in Prototype (In-Scope):</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-emerald-950 dark:text-emerald-200">
                      <li>Complete CRUD operations for coursework items</li>
                      <li>Relative urgency calculations with color-blind accessible indicators</li>
                      <li>AI milestone decomposition and interactive subtask checklists</li>
                      <li>Browser LocalStorage persistence + JSON backup import/export</li>
                      <li>Pre-seeded realistic university sample datasets</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <strong className="text-slate-800 dark:text-slate-200 block mb-1">Identified Limitations & Future Work:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600 dark:text-slate-400">
                      <li>Client-centric storage (no remote multi-device sync without database)</li>
                      <li>No direct automated Canvas/Moodle LMS OAuth scrapers</li>
                      <li>Single-student view rather than university instructor gradebook</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                Questions You May Be Asked in Your Viva & Sample Answers
              </h3>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                  Q1: Why did you choose LocalStorage over an external database for this prototype?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Answer:</strong> LocalStorage provides zero-latency client-side caching with zero configuration hurdles. For a student-focused prototype, it ensures privacy (all personal assignments stay on device) and enables instantaneous demo readiness during evaluation.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                  Q2: How does the application handle potential AI model latency or API failures?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Answer:</strong> We implement an asynchronous loading state with skeleton UI, and our Express proxy features a rule-based heuristic fallback engine. If the network drops or API quotas are exceeded, the app falls back transparently without throwing a runtime error.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                  Q3: How does this project meet software engineering best practices?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  <strong>Answer:</strong> We follow strict TypeScript typing, separation of concerns (presentation, storage, API), WCAG AA color accessibility, and clean component modularity with zero mock stub handlers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
