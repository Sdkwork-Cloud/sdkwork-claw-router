interface StorageStatusBadgeProps {
  status: string;
}

const statusClasses: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  healthy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  degraded: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  unavailable: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  enabled: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  disabled: 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
  running: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
  failed: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300',
  scheduled: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
  'in_progress': 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
  'in progress': 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
};

export function StorageStatusBadge({ status }: StorageStatusBadgeProps) {
  const normalized = status.trim().toLowerCase() || 'unknown';
  const className = statusClasses[normalized] ?? 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300';
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {normalized}
    </span>
  );
}