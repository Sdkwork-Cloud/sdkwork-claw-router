import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { CourseDrawer } from '../components/CourseDrawer';
import { CoursePageShell } from '../components/CoursePageShell';
import { CourseStatusBadge } from '../components/CourseStatusBadge';
import {
  CourseIconActionButton,
  CourseTableActions,
  CourseTablePanel,
} from '../components/CourseTableControls';
import { ApplicationReviewForm } from '../forms/ApplicationReviewForm';
import type { ApplicationReviewFormValues } from '../forms/ApplicationReviewForm';
import { CourseAdminService } from '../courseAdminService';

type CourseRecord = Record<string, unknown>;

export function CourseApplicationsPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [reviewingRecord, setReviewingRecord] = useState<CourseRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CourseAdminService.fetchApplications();
      setRecords(extractRecordList(result));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.courses.states.errorTitle', 'Applications could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const openReviewDrawer = (record: CourseRecord) => {
    setReviewingRecord(record);
    setIsDrawerOpen(true);
  };

  const handleReview = async (input: ApplicationReviewFormValues) => {
    if (!reviewingRecord) return;
    const id = String(reviewingRecord.id ?? '');
    await CourseAdminService.reviewApplication(id, input as never);
    setIsDrawerOpen(false);
    setReviewingRecord(null);
    await loadApplications();
  };

  return (
    <>
      <CoursePageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadApplications}
      >
        <CourseTablePanel>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.id', 'ID')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.title', 'Title')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.category', 'Category')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.sourceProvider', 'Source')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.contactName', 'Contact')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.status', 'Status')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.submittedAt', 'Submitted')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('common.actions.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-400">
                    {t('admin.courses.states.emptyTitle', 'No course records')}
                  </td>
                </tr>
              ) : records.map((record, index) => (
                <tr key={recordKey(record, index)} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="max-w-[100px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.id)}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{formatCell(record.title)}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.category)}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.sourceProvider)}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.contactName)}</td>
                  <td className="px-4 py-2.5"><CourseStatusBadge status={String(record.status ?? '')} /></td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.submittedAt)}</td>
                  <td className="px-4 py-2.5">
                    <CourseTableActions>
                      <CourseIconActionButton
                        label={t('admin.courses.applications.review', 'Review')}
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => openReviewDrawer(record)}
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
        title={t('admin.courses.applications.reviewTitle', 'Review Application')}
        description={reviewingRecord ? String(reviewingRecord.title ?? '') : undefined}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <ApplicationReviewForm
          initialValue={reviewingRecord ? {
            status: String(reviewingRecord.status ?? 'pending'),
          } : null}
          onCancel={() => setIsDrawerOpen(false)}
          onSubmit={handleReview}
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
