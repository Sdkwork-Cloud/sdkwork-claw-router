import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoursePageShell } from '../components/CoursePageShell';
import { CourseTablePanel } from '../components/CourseTableControls';
import { CourseAdminService } from '../courseAdminService';

export function CourseDashboardPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<Array<{ metric: string; value: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CourseAdminService.fetchDashboard();
      const data = extractMetrics(result);
      setMetrics(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.courses.states.errorTitle', 'Dashboard could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <CoursePageShell
      isLoading={isLoading}
      error={error}
      onRefresh={loadDashboard}
    >
      <CourseTablePanel>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.metric', 'Metric')}</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.courses.table.value', 'Value')}</th>
            </tr>
          </thead>
          <tbody>
            {metrics.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-12 text-center text-sm text-slate-400">
                  {t('admin.courses.states.emptyTitle', 'No course records')}
                </td>
              </tr>
            ) : metrics.map((item, index) => (
              <tr key={index} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{item.metric}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CourseTablePanel>
    </CoursePageShell>
  );
}

function extractMetrics(result: unknown): Array<{ metric: string; value: string }> {
  if (!result || typeof result !== 'object') {
    return [];
  }
  const obj = result as Record<string, unknown>;
  const data = obj.data ?? result;
  if (!data || typeof data !== 'object') {
    return [];
  }
  const source = data as Record<string, unknown>;
  return Object.entries(source)
    .filter(([, v]) => typeof v !== 'object' || v === null)
    .map(([key, val]) => ({
      metric: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
      value: String(val ?? '-'),
    }));
}
