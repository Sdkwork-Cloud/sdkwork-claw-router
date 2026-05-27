import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CoursePageShell } from '../components/CoursePageShell';
import { CourseStatusBadge } from '../components/CourseStatusBadge';
import { CourseTablePanel } from '../components/CourseTableControls';
import { CourseAdminService } from '../courseAdminService';

export function CourseEngagementPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEngagement = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CourseAdminService.fetchEngagement();
      const data = extractRecordList(result);
      setRecords(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.courses.states.errorTitle', 'Engagement data could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadEngagement();
  }, [loadEngagement]);

  return (
    <CoursePageShell
      isLoading={isLoading}
      error={error}
      onRefresh={loadEngagement}
    >
      <CourseTablePanel>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.id', 'ID')}</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.courseId', 'Course ID')}</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.reactionType', 'Reaction')}</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.reactionValue', 'Value')}</th>
              <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.courses.table.count', 'Count')}</th>
              <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.status', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  {t('admin.courses.states.emptyTitle', 'No course records')}
                </td>
              </tr>
            ) : records.map((record, index) => (
              <tr key={recordKey(record, index)} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="max-w-[120px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.id)}</td>
                <td className="max-w-[120px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.courseId)}</td>
                <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{formatCell(record.reactionType)}</td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.reactionValue)}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatCell(record.count)}</td>
                <td className="px-4 py-2.5"><CourseStatusBadge status={String(record.status ?? '')} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CourseTablePanel>
    </CoursePageShell>
  );
}

function extractRecordList(result: unknown): Record<string, unknown>[] {
  if (!result || typeof result !== 'object') return [];
  const obj = result as Record<string, unknown>;
  const data = obj.data ?? result;
  if (Array.isArray(data)) return data.filter((v) => typeof v === 'object' && v !== null) as Record<string, unknown>[];
  if (data && typeof data === 'object') {
    for (const key of ['items', 'records', 'list']) {
      const items = (data as Record<string, unknown>)[key];
      if (Array.isArray(items)) return items.filter((v) => typeof v === 'object' && v !== null) as Record<string, unknown>[];
    }
  }
  return [];
}

function recordKey(record: Record<string, unknown>, index: number): string {
  const id = record.id ?? record.uuid;
  return typeof id === 'string' && id ? id : String(index);
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}
