import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-clawrouter-pc-commons';

interface CoursePageShellProps {
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export function CoursePageShell({
  isLoading,
  error,
  onRefresh,
  children,
  actions,
}: CoursePageShellProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <BusinessStatePanel kind="loading" title={t('admin.courses.states.loadingTitle', 'Loading course records...')} className="min-h-48" />;
  }

  if (error) {
    return (
      <BusinessStatePanel
        kind="error"
        title={t('admin.courses.states.errorTitle', 'Course records could not be loaded')}
        description={error}
        onRetry={onRefresh}
        className="min-h-48"
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex items-center justify-end rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t('common.actions.reload', 'Reload')}
          </button>
          {actions}
        </div>
      </div>
      {children}
    </div>
  );
}
