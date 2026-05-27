import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';
import { CourseDrawer } from '../components/CourseDrawer';
import { CoursePageShell } from '../components/CoursePageShell';
import { CourseStatusBadge } from '../components/CourseStatusBadge';
import {
  CourseIconActionButton,
  CourseTableActions,
  CourseTablePanel,
} from '../components/CourseTableControls';
import { CommentModerationForm } from '../forms/CommentModerationForm';
import type { CommentModerationFormValues } from '../forms/CommentModerationForm';
import { CourseAdminService } from '../courseAdminService';

type CourseRecord = Record<string, unknown>;

export function CourseCommentsPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [moderatingRecord, setModeratingRecord] = useState<CourseRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CourseAdminService.fetchComments();
      setRecords(extractRecordList(result));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.courses.states.errorTitle', 'Comments could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const openModerationDrawer = (record: CourseRecord) => {
    setModeratingRecord(record);
    setIsDrawerOpen(true);
  };

  const handleModerate = async (input: CommentModerationFormValues) => {
    if (!moderatingRecord) return;
    const id = String(moderatingRecord.id ?? '');
    await CourseAdminService.moderateComment(id, input as never);
    setIsDrawerOpen(false);
    setModeratingRecord(null);
    await loadComments();
  };

  return (
    <>
      <CoursePageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadComments}
      >
        <CourseTablePanel>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.id', 'ID')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.courseId', 'Course ID')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.author', 'Author')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.content', 'Content')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.status', 'Status')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.createdAt', 'Created')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('common.actions.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    {t('admin.courses.states.emptyTitle', 'No course records')}
                  </td>
                </tr>
              ) : records.map((record, index) => (
                <tr key={recordKey(record, index)} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="max-w-[100px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.id)}</td>
                  <td className="max-w-[100px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.courseId)}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{formatCell(record.author)}</td>
                  <td className="max-w-[240px] truncate px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.content)}</td>
                  <td className="px-4 py-2.5"><CourseStatusBadge status={String(record.status ?? '')} /></td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    <CourseTableActions>
                      <CourseIconActionButton
                        label={t('admin.courses.comments.moderate', 'Moderate')}
                        icon={<Shield className="h-4 w-4" />}
                        onClick={() => openModerationDrawer(record)}
                      />
                    </CourseTableActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CourseTablePanel>
      </CoursePageShell>

      <CourseDrawer
        title={t('admin.courses.comments.moderateTitle', 'Moderate Comment')}
        description={moderatingRecord ? String(moderatingRecord.content ?? '').slice(0, 100) : undefined}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CommentModerationForm
          initialValue={moderatingRecord ? {
            status: String(moderatingRecord.status ?? 'pending'),
          } : null}
          onCancel={() => setIsDrawerOpen(false)}
          onSubmit={handleModerate}
        />
      </CourseDrawer>
    </>
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
