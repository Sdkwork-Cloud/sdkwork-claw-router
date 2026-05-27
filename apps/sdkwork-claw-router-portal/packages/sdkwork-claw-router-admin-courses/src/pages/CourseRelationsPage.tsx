import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus, Search } from 'lucide-react';
import { CourseDrawer } from '../components/CourseDrawer';
import { CoursePageShell } from '../components/CoursePageShell';
import { CourseStatusBadge } from '../components/CourseStatusBadge';
import {
  CourseDeleteConfirm,
  CourseIconActionButton,
  CourseTableActions,
  CourseTablePanel,
} from '../components/CourseTableControls';
import { CourseRelationForm } from '../forms/CourseRelationForm';
import type { CourseRelationFormValues } from '../forms/CourseRelationForm';
import { CourseAdminService } from '../courseAdminService';

type CourseRecord = Record<string, unknown>;

export function CourseRelationsPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<CourseRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<CourseRecord | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseIdDraft, setCourseIdDraft] = useState('');
  const [courseId, setCourseId] = useState('');

  const loadRelations = useCallback(async () => {
    const activeCourseId = courseId.trim() || 'default';
    setIsLoading(true);
    setError(null);
    try {
      const result = await CourseAdminService.fetchRelations(activeCourseId);
      setRecords(extractRecordList(result));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.courses.states.errorTitle', 'Relations could not be loaded'));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, t]);

  useEffect(() => {
    void loadRelations();
  }, [loadRelations]);

  const filteredRecords = useMemo(() => {
    if (!courseId.trim()) return records;
    const id = courseId.trim().toLowerCase();
    return records.filter((r) => String(r.courseId ?? '').toLowerCase().includes(id));
  }, [records, courseId]);

  const openCreateDrawer = () => {
    setEditingRecord(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (record: CourseRecord) => {
    setEditingRecord(record);
    setIsDrawerOpen(true);
  };

  const handleSave = async (input: CourseRelationFormValues) => {
    const payload = input as unknown as Record<string, unknown>;
    if (editingRecord) {
      const id = String(editingRecord.id ?? '');
      await CourseAdminService.updateCourse(id, { relationPayload: payload } as never);
    } else {
      const activeCourseId = courseId.trim() || 'default';
      await CourseAdminService.replaceRelations(activeCourseId, {
        relations: [{ ...payload }],
      } as never);
    }
    setIsDrawerOpen(false);
    setEditingRecord(null);
    await loadRelations();
  };

  const handleDelete = async (record: CourseRecord) => {
    const activeCourseId = String(record.courseId ?? (courseId.trim() || 'default'));
    try {
      await CourseAdminService.replaceRelations(activeCourseId, { relations: [] } as never);
    } catch {
    }
    await loadRelations();
  };

  return (
    <>
      <CoursePageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadRelations}
        actions={(
          <>
            <form
              className="inline-flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                setCourseId(courseIdDraft.trim());
              }}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-48 rounded-md border border-slate-200 py-1.5 pl-8 pr-2 text-xs text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  onChange={(event) => setCourseIdDraft(event.target.value)}
                  placeholder={t('admin.courses.filters.courseId', 'Course ID')}
                  type="text"
                  value={courseIdDraft}
                />
              </div>
              <button
                className="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                type="submit"
              >
                {t('admin.courses.filters.apply', 'Apply')}
              </button>
            </form>
            <button
              type="button"
              onClick={openCreateDrawer}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('admin.courses.relations.add', 'Add Relation')}
            </button>
          </>
        )}
      >
        <CourseTablePanel>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.id', 'ID')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.courseId', 'Course ID')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.relatedCourseId', 'Related Course')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.relationType', 'Relation')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('admin.courses.table.sortOrder', 'Order')}</th>
                <th className="px-4 py-2.5 text-left font-medium text-slate-500">{t('admin.courses.table.status', 'Status')}</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500">{t('common.actions.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    {t('admin.courses.states.emptyTitle', 'No course records')}
                  </td>
                </tr>
              ) : filteredRecords.map((record, index) => (
                <tr key={recordKey(record, index)} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="max-w-[100px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.id)}</td>
                  <td className="max-w-[100px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.courseId)}</td>
                  <td className="max-w-[100px] truncate px-4 py-2.5 text-xs text-slate-400">{formatCell(record.relatedCourseId)}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{formatCell(record.relationType)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatCell(record.sortOrder)}</td>
                  <td className="px-4 py-2.5"><CourseStatusBadge status={String(record.status ?? '')} /></td>
                  <td className="px-4 py-2.5">
                    <CourseTableActions>
                      <CourseIconActionButton label={t('common.actions.edit', 'Edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => openEditDrawer(record)} />
                      <CourseDeleteConfirm
                        title={t('admin.courses.relations.deleteTitle', 'Delete Relation')}
                        description={t('admin.courses.relations.deleteDesc', 'Are you sure you want to delete this relation?')}
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
          ? t('admin.courses.relations.editTitle', 'Edit Relation')
          : t('admin.courses.relations.addTitle', 'Add Relation')}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CourseRelationForm
          mode={editingRecord ? 'edit' : 'create'}
          initialValue={editingRecord ? {
            relatedCourseId: String(editingRecord.relatedCourseId ?? ''),
            relationType: String(editingRecord.relationType ?? ''),
            sortOrder: String(editingRecord.sortOrder ?? ''),
            status: String(editingRecord.status ?? ''),
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
