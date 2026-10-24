import React, { useState, useEffect, useMemo } from 'react';
import { Assignment, FilterOptions, SemesterStats, Subtask } from './types';
import { getSampleAssignments } from './utils/sampleData';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { AssignmentCard } from './components/AssignmentCard';
import { AssignmentModal } from './components/AssignmentModal';
import { AiPlanModal } from './components/AiPlanModal';
import { ReportModal } from './components/ReportModal';
import { Plus, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'student_assignments_v1';

export default function App() {
  // Main State
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored assignments:', e);
    }
    // Default to rich pre-seeded college dataset
    return getSampleAssignments();
  });

  // Filter State
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    courseCode: '',
    sortBy: 'dueDate',
  });

  // Modal States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPlanAssignment, setSelectedPlanAssignment] = useState<Assignment | null>(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [assignments]);

  // Toast Notification auto-dismiss
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Derive Semester Statistics
  const stats: SemesterStats = useMemo(() => {
    const total = assignments.length;
    const now = new Date().getTime();

    let pending = 0;
    let completed = 0;
    let dueSoon = 0;
    let overdue = 0;
    let totalEstimatedHours = 0;

    assignments.forEach((a) => {
      totalEstimatedHours += a.estimatedHours || 0;
      if (a.status === 'completed') {
        completed++;
      } else {
        pending++;
        const dueTime = new Date(a.dueDate).getTime();
        const diffHours = (dueTime - now) / (1000 * 60 * 60);

        if (diffHours < 0) {
          overdue++;
        } else if (diffHours <= 48) {
          dueSoon++;
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      dueSoon,
      overdue,
      completed,
      completionRate,
      totalEstimatedHours,
    };
  }, [assignments]);

  // Unique Courses list for dropdown
  const uniqueCourses = useMemo(() => {
    const set = new Set<string>();
    assignments.forEach((a) => {
      if (a.courseCode) set.add(a.courseCode);
    });
    return Array.from(set).sort();
  }, [assignments]);

  // Filter & Sort Logic
  const filteredAssignments = useMemo(() => {
    const now = new Date().getTime();

    return assignments.filter((a) => {
      // Search match
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(query);
        const matchesCourse = a.courseCode.toLowerCase().includes(query);
        const matchesDesc = a.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesCourse && !matchesDesc) return false;
      }

      // Course match
      if (filters.courseCode && a.courseCode !== filters.courseCode) {
        return false;
      }

      // Status filter
      if (filters.status === 'completed') {
        return a.status === 'completed';
      }
      if (filters.status === 'pending') {
        return a.status !== 'completed';
      }
      if (filters.status === 'due_soon') {
        if (a.status === 'completed') return false;
        const diffHours = (new Date(a.dueDate).getTime() - now) / (1000 * 60 * 60);
        return diffHours >= 0 && diffHours <= 48;
      }
      if (filters.status === 'overdue') {
        if (a.status === 'completed') return false;
        return new Date(a.dueDate).getTime() < now;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (filters.sortBy === 'priority') {
        const priorityOrder: Record<string, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [assignments, filters]);

  // Handlers
  const handleToggleStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === 'completed' ? 'pending' : 'completed';
          return {
            ...a,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Assignment removed');
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsNewModalOpen(true);
  };

  const handleSaveAssignment = async (data: Partial<Assignment>, generateAiImmediately: boolean) => {
    if (editingAssignment) {
      // Update existing
      setAssignments((prev) =>
        prev.map((a) => (a.id === editingAssignment.id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a))
      );
      showToast('Assignment updated successfully');
      setEditingAssignment(null);
    } else {
      // Create new
      const newAssignment: Assignment = {
        id: `asg-${Date.now()}`,
        title: data.title || 'Untitled Assignment',
        courseCode: data.courseCode || 'GEN101',
        courseName: data.courseName || data.courseCode || 'General Course',
        dueDate: data.dueDate || new Date().toISOString(),
        priority: data.priority || 'medium',
        status: 'pending',
        description: data.description || '',
        estimatedHours: data.estimatedHours || 4,
        colorTag: 'indigo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAssignments((prev) => [newAssignment, ...prev]);
      showToast('New assignment added');

      if (generateAiImmediately) {
        setSelectedPlanAssignment(newAssignment);
        setIsPlanModalOpen(true);
        await generateAiPlan(newAssignment);
      }
    }
  };

  // AI Plan Generator API Call
  const generateAiPlan = async (assignment: Assignment) => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: assignment.title,
          courseCode: assignment.courseCode,
          courseName: assignment.courseName,
          description: assignment.description,
          dueDate: assignment.dueDate,
          priority: assignment.priority,
          estimatedHours: assignment.estimatedHours,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const planData = await response.json();
      
      const newPlan = {
        summary: planData.summary,
        recommendedDailyMinutes: planData.recommendedDailyMinutes || 45,
        subtasks: (planData.subtasks || []).map((s: any, idx: number) => ({
          id: `${assignment.id}-s-${idx}-${Date.now()}`,
          title: s.title,
          estimatedMinutes: s.estimatedMinutes || 30,
          stage: s.stage || 'Milestone',
          completed: false,
        })),
        studyTips: planData.studyTips || [],
        generatedAt: new Date().toISOString(),
        isFallback: planData.isFallback,
      };

      // Update in assignments list
      setAssignments((prev) =>
        prev.map((a) => (a.id === assignment.id ? { ...a, aiPlan: newPlan, updatedAt: new Date().toISOString() } : a))
      );

      // Update currently viewed assignment in modal
      setSelectedPlanAssignment((current) => (current && current.id === assignment.id ? { ...current, aiPlan: newPlan } : current));

      showToast(newPlan.isFallback ? 'Generated study schedule (offline fallback)' : 'AI study schedule generated with Gemini 3.8!');
    } catch (err: any) {
      console.error('Failed to generate plan:', err);
      showToast('Could not reach AI service; plan generation failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Subtask completion toggling
  const handleUpdateSubtask = (assignmentId: string, subtaskId: string, completed: boolean) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId && a.aiPlan) {
          const updatedSubtasks = a.aiPlan.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed } : s));
          const allCompleted = updatedSubtasks.every((s) => s.completed);
          return {
            ...a,
            status: allCompleted ? 'completed' : a.status === 'completed' ? 'in_progress' : a.status,
            aiPlan: {
              ...a.aiPlan,
              subtasks: updatedSubtasks,
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    // Keep active modal selection synced
    setSelectedPlanAssignment((current) => {
      if (current && current.id === assignmentId && current.aiPlan) {
        return {
          ...current,
          aiPlan: {
            ...current.aiPlan,
            subtasks: current.aiPlan.subtasks.map((s) => (s.id === subtaskId ? { ...s, completed } : s)),
          },
        };
      }
      return current;
    });
  };

  // Custom subtask creation
  const handleAddCustomSubtask = (assignmentId: string, title: string, minutes: number) => {
    const newSubtask: Subtask = {
      id: `${assignmentId}-custom-${Date.now()}`,
      title,
      estimatedMinutes: minutes,
      stage: 'Custom Task',
      completed: false,
    };

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId && a.aiPlan) {
          return {
            ...a,
            aiPlan: {
              ...a.aiPlan,
              subtasks: [...a.aiPlan.subtasks, newSubtask],
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    setSelectedPlanAssignment((current) => {
      if (current && current.id === assignmentId && current.aiPlan) {
        return {
          ...current,
          aiPlan: {
            ...current.aiPlan,
            subtasks: [...current.aiPlan.subtasks, newSubtask],
          },
        };
      }
      return current;
    });
  };

  // Load Sample Semester
  const handleLoadDemoData = () => {
    const samples = getSampleAssignments();
    setAssignments(samples);
    showToast('Loaded 5 sample semester assignments');
  };

  // Export JSON backup
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(assignments, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `student_assignments_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Assignments exported to JSON');
  };

  // Import JSON backup
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setAssignments(parsed);
            showToast(`Imported ${parsed.length} assignments successfully`);
          } else {
            alert('Invalid backup format: Expected an array of assignments');
          }
        } catch {
          alert('Could not parse JSON file');
        }
      };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenNewModal={() => {
          setEditingAssignment(null);
          setIsNewModalOpen(true);
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onLoadDemoData={handleLoadDemoData}
        assignmentCount={assignments.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header / Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Semester Academic Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track course deadlines, manage completed work, and generate AI-driven milestone study schedules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors cursor-pointer"
            >
              Academic Spec & Viva Q&A
            </button>
          </div>
        </div>

        {/* 4-KPI Metric Strip */}
        <StatsBar stats={stats} />

        {/* Filter & Search Bar */}
        <FilterBar
          filters={filters}
          courses={uniqueCourses}
          onFilterChange={setFilters}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* Assignments Grid */}
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onToggleStatus={handleToggleStatus}
                onOpenAiPlan={(asg) => {
                  setSelectedPlanAssignment(asg);
                  setIsPlanModalOpen(true);
                  if (!asg.aiPlan) {
                    generateAiPlan(asg);
                  }
                }}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
              />
            ))}
          </div>
        ) : (
          /* Empty / Zero State */
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                No assignments found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {filters.search || filters.courseCode || filters.status !== 'all'
                  ? 'No coursework matches your active filters. Try clearing or expanding your search query.'
                  : 'Your academic assignment queue is empty. Click below to add your first coursework or load sample semester data.'}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {filters.search || filters.courseCode || filters.status !== 'all' ? (
                <button
                  onClick={() =>
                    setFilters({
                      search: '',
                      status: 'all',
                      courseCode: '',
                      sortBy: 'dueDate',
                    })
                  }
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingAssignment(null);
                      setIsNewModalOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Assignment</span>
                  </button>
                  <button
                    onClick={handleLoadDemoData}
                    className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Load Demo Semester
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>
            Student Assignment &amp; Deadline Tracker · University Project Demonstration
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-medium"
            >
              Academic Viva Specification
            </button>
            <span aria-hidden="true">·</span>
            <span>Local Persistence + Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AssignmentModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSaveAssignment}
        editingAssignment={editingAssignment}
      />

      <AiPlanModal
        assignment={selectedPlanAssignment}
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setSelectedPlanAssignment(null);
        }}
        onUpdateSubtask={handleUpdateSubtask}
        onRegeneratePlan={generateAiPlan}
        onAddSubtask={handleAddCustomSubtask}
        isLoading={isAiLoading}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
