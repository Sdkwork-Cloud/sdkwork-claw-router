import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus } from 'lucide-react';
import { CourseDrawer } from '../components/CourseDrawer';
import { CoursePageShell } from '../components/CoursePageShell';
import { CourseStatusBadge } from '../components/CourseStatusBadge';
import {
  CourseDeleteConfirm,
  CourseIconActionButton,
  CourseTableActions,
  CourseTablePanel,
} from '../components/CourseTableControls';
import { CourseForm } from '../forms/CourseForm';
import type { CourseFormValues } from '../forms/CourseForm';
import { CourseAdminService } from '../courseAdminService';

type CourseRecord = Record<string, unknown>;

export function CourseCatalogPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<CourseRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await CourseAdminService.fetchCourses();
      setRecords(extractRecordList(result));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.courses.states.errorTitle', 'Course catalog could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const openCreateDrawer = () => {
    setEditingRecord(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (record: CourseRecord) => {
    setEditingRecord(record);
    setIsDrawerOpen(true);
  };

  const handleSave = async (input: CourseFormValues) => {
    const payload = input as unknown as Record<string, unknown>;
    if (editingRecord) {
      const id = String(editingRecord.id ?? '');
      await CourseAdminService.updateCourse(id, payload as never);
    } else {
      await CourseAdminService.createCourse(payload as never);
    }
    setIsDrawerOpen(false);
    setEditingRecord(null);
    await loadCatalog();
  };

  const handleDelete = async (record: CourseRecord) => {
    const id = String(record.id ?? '');
    await CourseAdminService.deleteCourse(id);
    await loadCatalog();
  };

  return (
    <>
      <CoursePageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadCatalog}
        actions={(
          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('admin.courses.catalog.add', 'Add Course')}
          </button>
        )}
      >
        <CourseTablePanel>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.id', 'ID')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.courseCode', 'Code')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.title', 'Title')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.category', 'Category')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.level', 'Level')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.status', 'Status')}</th>
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
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{formatCell(record.courseCode)}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.title)}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.category)}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{formatCell(record.level)}</td>
                  <td className="px-4 py-2.5"><CourseStatusBadge status={String(record.status ?? '')} /></td>
                  <td className="px-4 py-2.5">
                    <CourseTableActions>
                      <CourseIconActionButton label={t('common.actions.edit', 'Edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => openEditDrawer(record)} />
                      <CourseDeleteConfirm
                        title={t('admin.courses.catalog.deleteTitle', 'Delete Course')}
                        description={t('admin.courses.catalog.deleteDesc', 'Are you sure you want to delete this course? This action cannot be undone.')}
                        onConfirm={() => handleDelete(record)}
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
        title={editingRecord
          ? t('admin.courses.catalog.editTitle', 'Edit Course')
          : t('admin.courses.catalog.addTitle', 'Add Course')}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CourseForm
          mode={editingRecord ? 'edit' : 'create'}
          initialValue={editingRecord ? {
            courseCode: String(editingRecord.courseCode ?? ''),
            title: String(editingRecord.title ?? ''),
            category: String(editingRecord.category ?? ''),
            level: String(editingRecord.level ?? ''),
            status: String(editingRecord.status ?? ''),
            description: String(editingRecord.description ?? ''),
          } : null}
          onCancel={() => setIsDrawerOpen(false)}
          onSubmit={handleSave}
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
