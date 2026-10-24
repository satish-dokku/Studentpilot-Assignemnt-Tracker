# Student Assignment & Deadline Tracker

A clean, modern academic task and deadline management web prototype designed for college students to track coursework, monitor countdowns, and generate AI-driven milestone breakdowns and study schedules for complex assignments.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design and architectural choices have been confirmed for your university semester examination prototype:

- **Confirmed AI Feature**: **AI Smart Breakdown and Study Plan Generator**. Students can enter an assignment topic and deadline, and Gemini 3.8 Flash generates an actionable step-by-step checklist with suggested daily milestones and time allocations.
- **Confirmed Data Persistence**: **Browser LocalStorage** with one-click **"Load Demo Semester Data"** and **"Reset"** buttons. This guarantees an instant, zero-configuration viva demonstration that functions reliably without external database dependencies.
- **Confirmed Visual Interface**: **Clean Modern Academic UI** with high-contrast status cards, countdown timers with tabular numerals, course color indicators, and segmented filter controls.

---

## 1. Overview & Core Concept

### 1.1 What It Does
**Student Assignment & Deadline Tracker** is a responsive, web-based productivity application tailored to university workflows. It allows students to:
1. Log coursework assignments with course codes, submission deadlines, estimated effort, and priority ratings.
2. View pending vs. completed tasks, upcoming deadlines sorted chronologically, and visual countdowns (e.g., "Due in 2 days", "Due tomorrow", "Overdue").
3. Use an **AI Study Plan Generator** powered by Gemini 3.8 Flash that dissects complex assignments (e.g., research papers, lab reports, coding projects) into manageable subtasks and realistic study schedules.
4. Mark milestones and assignments as completed with real-time progress bar recalculations.

### 1.2 Target Audience & Persona
- **Primary Persona**: Undergraduate and postgraduate college students juggling 4–6 simultaneous courses with overlapping deadlines, lab submissions, and term papers.
- **Secondary Persona**: University examination evaluators and professors reviewing beginner-friendly yet technically sound software engineering capstone prototypes.

### 1.3 Key Value
Eliminates academic deadline anxiety and last-minute cramming by combining intuitive priority tracking with AI-guided task decomposition.

---

## 2. User Experience & Visual Design

### 2.1 Key User Flows
1. **Dashboard Overview**: Student loads the app and immediately sees a 4-metric summary bar (Total Assignments, Due This Week, Pending, Completed) alongside an urgency-sorted task list.
2. **Adding an Assignment**: Student clicks "New Assignment", fills in title, course (e.g., `CS301 - Operating Systems`), due date/time, and difficulty level.
3. **Triggering AI Breakdown**: For any pending task, the student clicks **"AI Study Plan"**. Gemini analyzes the assignment requirements and deadline, returning:
   - 3 to 5 chronological subtasks with estimated completion times
   - Recommended daily study milestones leading up to the due date
   - Key success tips for the assignment type
4. **Tracking Progress**: Checking off subtasks updates the assignment's internal completion percentage. Once all subtasks are finished, the student toggles the main assignment status to "Completed".
5. **Filtering & Searching**: Instant client-side filtering by Course, Urgency Status (All, Due Soon, Overdue, Completed), or text search.

### 2.2 Visual Identity & Theme
- **Aesthetic Direction**: Contemporary Academic SaaS Dashboard — crisp typography, generous whitespace, subtle hairline dividers, and high legibility.
- **Typography**: 
  - Display & Headings: `Plus Jakarta Sans` / `Outfit` (clean geometric sans with academic polish)
  - Body & Form Controls: `DM Sans` / `Plus Jakarta Sans` (14px–15px)
  - Numbers, Dates & Countdowns: Monospace tabular numerals (`font-mono tabular-nums`) to prevent layout shift during countdowns.
- **Color Palette (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Clean neutral soft background (`bg-slate-50` / `dark:bg-slate-950`).
  - **30% Structural Surfaces**: Pure white cards (`bg-white` / `dark:bg-slate-900`) with subtle 1px border lines (`border-slate-200/80`).
  - **10% Semantic Accents**: Deep academic indigo (`#4F46E5` / `bg-indigo-600`) for primary actions; semantic state badges (Emerald `#10B981` for Complete, Amber `#F59E0B` for Due Soon, Rose `#EF4444` for Overdue).
- **Anti-Slop Restraint**: No floating sparkle icons, no unnecessary nested cards, no purple neon glows, and no static pill badges in headers. Unboxed text separators (`·`) for metadata.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: AI Model & Architecture
- **Chosen Approach**: Server-side proxy route `/api/ai/breakdown` using `@google/genai` TypeScript SDK and `gemini-3.8-flash` with structured JSON schema (`responseSchema`).
- **Why**: Keeps API credentials secure on the server, guarantees structured typed JSON output (subtasks, estimated hours, tips), and avoids client-side bundle bloat.
- **Fallback**: Includes a robust offline heuristic fallback generator in case network connectivity or API quotas are interrupted during viva presentations.

### Decision 2: State Persistence & Demo Workflow
- **Chosen Approach**: Reactive `localStorage` wrapper with initial state pre-hydration and sample academic dataset.
- **Why**: Completely self-contained, instant load times, zero configuration during presentation, and preserves student edits across browser refreshes.

### Decision 3: Beginner-Friendly Code Quality
- **Chosen Approach**: Modular TypeScript components (`AssignmentCard`, `AssignmentModal`, `AiPlanDrawer`, `StatsBar`, `FilterBar`) with clear inline comments explaining software engineering concepts for end-semester viva defense.

---

## 4. Technical Architecture & Data Strategy

### 4.1 System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 Client UI                              │
│                                                                        │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────────────┐  │
│  │   Top Navbar    │  │  Metric KPI Bar  │  │   Filter & Search     │  │
│  └─────────────────┘  └──────────────────┘  └───────────────────────┘  │
│  ┌───────────────────────────────────────┐  ┌───────────────────────┐  │
│  │       Assignment Grid / Cards         │  │   AI Study Drawer     │  │
│  │  - Status Badges   - Tabular Due Date │  │  - Milestone timeline │  │
│  │  - Subtask toggle  - Priority Tag     │  │  - Time allocation   │  │
│  └───────────────────────────────────────┘  └───────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────┐                         ┌───────────────────────┐
│ Browser LocalStorage │                         │ Express Server (3000) │
│ - assignments[]      │                         │  POST /api/ai/plan    │
│ - userPreferences    │                         └───────────┬───────────┘
└──────────────────────┘                                     │
                                                             ▼
                                                 ┌───────────────────────┐
                                                 │ @google/genai SDK     │
                                                 │ Model: gemini-3.8-    │
                                                 │        flash          │
                                                 └───────────────────────┘
```

### 4.2 Data Model Schema

```typescript
export interface Subtask {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
}

export interface AiStudyPlan {
  summary: string;
  recommendedDailyMinutes: number;
  subtasks: Subtask[];
  studyTips: string[];
  generatedAt: string;
}

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string; // ISO string
  priority: PriorityLevel;
  status: AssignmentStatus;
  description?: string;
  estimatedHours: number;
  aiPlan?: AiStudyPlan;
  createdAt: string;
}
```

---

## 5. College Project Report Sections

The user request specifically requires a formal Software Project Analysis formatted for a university examination submission. This includes:
1. **Real-World Problem**: Academic deadline fragmentation, cognitive overload, poor time estimation, and procrastination.
2. **Project Objective**: To build an accessible, automated task tracker that converts passive deadlines into active, AI-assisted milestone schedules.
3. **Target Users**: College students, academic advisors, and study groups.
4. **Proposed Solution**: A lightweight web application integrating structured deadline management with GenAI task breakdown.
5. **Core Features**: CRUD assignment management, countdown indicators, AI study planner, completion metrics, and pre-seeded college templates.
6. **Project Scope & Limitations**: Explicit boundaries separating prototype features from enterprise LMS systems.
