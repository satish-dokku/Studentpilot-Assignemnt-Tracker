/**
 * Date and urgency calculation utilities for student deadlines
 */

export interface UrgencyInfo {
  label: string;
  type: 'overdue' | 'due_soon' | 'upcoming' | 'future' | 'completed';
  badgeClass: string;
  isUrgent: boolean;
}

export function getUrgencyInfo(dueDateStr: string, isCompleted: boolean): UrgencyInfo {
  if (isCompleted) {
    return {
      label: 'Completed',
      type: 'completed',
      badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
      isUrgent: false,
    };
  }

  const now = new Date();
  const due = new Date(dueDateStr);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    const label = overdueDays <= 1 ? `Overdue by ${Math.abs(diffHours)}h` : `Overdue by ${overdueDays}d`;
    return {
      label,
      type: 'overdue',
      badgeClass: 'text-rose-700 bg-rose-50 border border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
      isUrgent: true,
    };
  }

  if (diffHours <= 12) {
    return {
      label: `Due in ${Math.max(1, diffHours)}h`,
      type: 'due_soon',
      badgeClass: 'text-rose-600 bg-rose-50 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60 font-semibold',
      isUrgent: true,
    };
  }

  if (diffHours <= 24) {
    return {
      label: 'Due Today',
      type: 'due_soon',
      badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 font-medium',
      isUrgent: true,
    };
  }

  if (diffDays <= 2) {
    return {
      label: 'Due Tomorrow',
      type: 'due_soon',
      badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
      isUrgent: true,
    };
  }

  if (diffDays <= 7) {
    return {
      label: `Due in ${diffDays} days`,
      type: 'upcoming',
      badgeClass: 'text-indigo-700 bg-indigo-50 border border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
      isUrgent: false,
    };
  }

  return {
    label: `Due in ${diffDays} days`,
    type: 'future',
    badgeClass: 'text-slate-600 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    isUrgent: false,
  };
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export function formatShortDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}
