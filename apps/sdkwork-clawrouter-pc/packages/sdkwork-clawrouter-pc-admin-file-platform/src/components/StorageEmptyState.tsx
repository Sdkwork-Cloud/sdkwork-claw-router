import { Plus, type LucideIcon } from 'lucide-react';

interface StorageEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  icon?: LucideIcon;
  onAction?: () => void;
}

export function StorageEmptyState({
  title,
  description,
  actionLabel,
  icon: Icon,
  onAction,
}: StorageEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
        {Icon ? <Icon className="h-6 w-6 text-slate-400" /> : null}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}