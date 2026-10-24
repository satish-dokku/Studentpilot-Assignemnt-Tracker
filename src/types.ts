export interface Subtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  stage: string;
  completed: boolean;
}

export interface AiStudyPlan {
  summary: string;
  recommendedDailyMinutes: number;
  subtasks: Subtask[];
  studyTips: string[];
  generatedAt: string;
  isFallback?: boolean;
}

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string; // ISO string or YYYY-MM-DDTHH:mm
  priority: PriorityLevel;
  status: AssignmentStatus;
  description?: string;
  estimatedHours: number;
  colorTag: string; // e.g. 'indigo', 'emerald', 'sky', 'amber', 'rose', 'purple'
  aiPlan?: AiStudyPlan;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  search: string;
  status: 'all' | 'pending' | 'due_soon' | 'overdue' | 'completed';
  courseCode: string;
  sortBy: 'dueDate' | 'priority' | 'title';
}

export interface SemesterStats {
  total: number;
  pending: number;
  dueSoon: number;
  overdue: number;
  completed: number;
  completionRate: number;
  totalEstimatedHours: number;
}
