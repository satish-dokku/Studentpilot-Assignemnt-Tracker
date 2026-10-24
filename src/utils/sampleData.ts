import { Assignment } from '../types';

export function getSampleAssignments(): Assignment[] {
  const now = new Date();

  // Helper to add days/hours relative to now
  const addHours = (hours: number): string => {
    const d = new Date(now.getTime() + hours * 60 * 60 * 1000);
    // Format to YYYY-MM-DDTHH:mm
    return d.toISOString().slice(0, 16);
  };

  return [
    {
      id: 'demo-1',
      title: 'Process Synchronization & Semaphore Lab Report',
      courseCode: 'CS301',
      courseName: 'Operating Systems',
      dueDate: addHours(30), // ~Due tomorrow
      priority: 'high',
      status: 'pending',
      description: 'Implement producer-consumer problem using POSIX mutexes and semaphores in C. Submit code and 4-page analysis report.',
      estimatedHours: 6,
      colorTag: 'indigo',
      aiPlan: {
        summary: 'Targeted implementation and writeup workflow emphasizing concurrency correctness and test output verification.',
        recommendedDailyMinutes: 90,
        subtasks: [
          {
            id: 'demo-1-s1',
            title: 'Review lecture slides on mutex locks & binary semaphores',
            estimatedMinutes: 45,
            stage: 'Preparation',
            completed: true,
          },
          {
            id: 'demo-1-s2',
            title: 'Implement producer/consumer buffer in C with pthreads',
            estimatedMinutes: 120,
            stage: 'Implementation',
            completed: false,
          },
          {
            id: 'demo-1-s3',
            title: 'Simulate race conditions and benchmark throughput',
            estimatedMinutes: 60,
            stage: 'Testing',
            completed: false,
          },
          {
            id: 'demo-1-s4',
            title: 'Draft lab report with execution screenshots and references',
            estimatedMinutes: 90,
            stage: 'Final Review',
            completed: false,
          },
        ],
        studyTips: [
          'Compile with -Wall -Wextra -pthread flags in GCC to catch subtle race condition warnings.',
          'Include diagrams showing critical section entry and exit protocols.',
          'Test edge cases where buffer is completely empty or full.',
        ],
        generatedAt: new Date().toISOString(),
      },
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Eigenvalues & Diagonalization Problem Set 4',
      courseCode: 'MATH204',
      courseName: 'Linear Algebra',
      dueDate: addHours(14), // Due today / very soon
      priority: 'urgent',
      status: 'in_progress',
      description: 'Complete problems 12 through 28 on characteristic polynomials, geometric multiplicity, and matrix diagonalization.',
      estimatedHours: 4,
      colorTag: 'amber',
      aiPlan: {
        summary: 'Focused problem-solving regimen targeting algebraic vs. geometric multiplicity proof techniques.',
        recommendedDailyMinutes: 60,
        subtasks: [
          {
            id: 'demo-2-s1',
            title: 'Solve characteristic polynomial problems (Q12-Q18)',
            estimatedMinutes: 60,
            stage: 'Problem Solving',
            completed: true,
          },
          {
            id: 'demo-2-s2',
            title: 'Calculate eigenvectors & verify linearly independent sets (Q19-Q24)',
            estimatedMinutes: 75,
            stage: 'Problem Solving',
            completed: true,
          },
          {
            id: 'demo-2-s3',
            title: 'Complete diagonalization theorems and write clean step proofs (Q25-Q28)',
            estimatedMinutes: 60,
            stage: 'Final Verification',
            completed: false,
          },
        ],
        studyTips: [
          'Remember: An n x n matrix is diagonalizable if and only if the sum of dimensions of its eigenspaces is n.',
          'Double check determinant signs when expanding 3x3 characteristic matrices.',
          'Format final solutions with clear intermediate matrix row-reduction steps.',
        ],
        generatedAt: new Date().toISOString(),
      },
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Software Requirements Specification (SRS) Document',
      courseCode: 'SE410',
      courseName: 'Software Engineering',
      dueDate: addHours(120), // Due in 5 days
      priority: 'medium',
      status: 'pending',
      description: 'Author IEEE-830 compliant SRS document for university hostel room allocation portal including use cases and ER diagrams.',
      estimatedHours: 8,
      colorTag: 'sky',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Research Paper: Ethical Implications of Generative AI in Higher Ed',
      courseCode: 'ENG102',
      courseName: 'Academic Writing & Ethics',
      dueDate: addHours(-20), // Completed yesterday
      priority: 'low',
      status: 'completed',
      description: '2,500-word APA format paper analyzing student AI adoption, academic integrity policies, and institutional grading reforms.',
      estimatedHours: 10,
      colorTag: 'emerald',
      createdAt: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      title: 'B+ Tree Indexing & Query Cost Optimization',
      courseCode: 'DB305',
      courseName: 'Database Management Systems',
      dueDate: addHours(192), // Due in 8 days
      priority: 'medium',
      status: 'pending',
      description: 'Simulate B+ tree split and merge operations under sequential vs random insertions. Calculate I/O block transfer costs.',
      estimatedHours: 5,
      colorTag: 'purple',
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}
