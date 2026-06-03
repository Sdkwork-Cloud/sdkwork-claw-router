import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil, Plus, Search } from 'lucide-react';
import { AdminTableShell } from 'sdkwork-claw-router-commons';
import { StorageDrawer } from '../components/StorageDrawer';
import { StoragePageShell } from '../components/StoragePageShell';
import { StorageStatusBadge } from '../components/StorageStatusBadge';
import { StorageEmptyState } from '../components/StorageEmptyState';
import {
  StorageIconActionButton,
  StorageTableActions,
} from '../components/StorageTableActions';
import { StorageReconciliationForm } from '../forms/StorageReconciliationForm';
import {
  fetchStorageReconciliations,
} from '../storageService';
import {
  STORAGE_SECTION_DEFINITIONS,
  type StorageRecord,
} from '../storageSectionDefinitions';

export function ReconciliationPage() {
  const { t } = useTranslation();
  const section = STORAGE_SECTION_DEFINITIONS.reconciliation;
  const [records, setRecords] = useState<StorageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StorageRecord | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStorageReconciliations();
      setRecords(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.filePlatform.storage.loadError', 'Failed to load records'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const handleEdit = (record: StorageRecord) => {
    setEditingRecord(record);
    setIsDrawerOpen(true);
  };

  const handleDrawerOpen = () => {
    setEditingRecord(undefined);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setEditingRecord(undefined);
  };

  const handleFormSuccess = () => {
    handleDrawerClose();
    void loadRecords();
  };

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      section.columns.some((col) => String(r[col.key] ?? '').toLowerCase().includes(q)),
    );
  }, [records, search, section.columns]);

  const pagedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const hasNextPage = filteredRecords.length > page * pageSize;

  const renderCell = (record: StorageRecord, columnKey: string) => {
    const value = record[columnKey] || '-';
    if (columnKey === 'status') {
      return <StorageStatusBadge status={value} />;
    }
    return value;
  };

  return (
    <>
      <StoragePageShell
        isLoading={isLoading}
        error={error}
        onRefresh={loadRecords}
        actions={(
          <button
            type="button"
            onClick={handleDrawerOpen}
            className="inline-flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            {section.buttonLabel}
          </button>
        )}
      >
        <AdminTableShell
          className="flex-1 min-h-0"
          viewportClassName="min-h-0 flex-1"
          header={(
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t('common.actions.search', 'Search')}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
              <span className="text-xs text-slate-400 tabular-nums">
                {t('admin.filePlatform.storage.records', '{{count}} records', { count: filteredRecords.length })}
              </span>
            </div>
          )}
          footer={
            filteredRecords.length > pageSize ? (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                <span>{t('admin.filePlatform.storage.showing', 'Showing {{start}}-{{end}} of {{total}}', { start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, filteredRecords.length), total: filteredRecords.length })}</span>
                <div className="flex gap-1">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-white/5">{t('common.pagination.prev', 'Prev')}</button>
                  <button disabled={!hasNextPage} onClick={() => setPage((p) => p + 1)} className="rounded px-2 py-1 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-white/5">{t('common.pagination.next', 'Next')}</button>
                </div>
              </div>
            ) : undefined
          }
        >
          {pagedRecords.length === 0 ? (
            <StorageEmptyState
              title={section.emptyTitle}
              description={section.emptyDescription}
              icon={section.icon}
              actionLabel={search ? undefined : section.buttonLabel}
              onAction={search ? undefined : handleDrawerOpen}
            />
          ) : (
            <>
              <table className="w-full min-w-[760px] text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
                <tr>
                  {section.columns.map((column) => (
                    <th
                      className={`px-4 py-3 font-semibold ${column.align === 'right' ? 'text-right' : ''}`}
                      key={column.key}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">{t('common.actions.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {pagedRecords.map((record, index) => (
                  <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={`${section.id}-${(page - 1) * pageSize + index}`}>
                    {section.columns.map((column) => (
                      <td
                        className={`max-w-[260px] truncate px-4 py-3 ${column.align === 'right' ? 'text-right tabular-nums' : ''}`}
                        key={column.key}
                        title={String(record[column.key] || '-')}
                      >
                        {renderCell(record, column.key)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <StorageTableActions>
                        <StorageIconActionButton label={t('common.actions.edit', 'Edit')} icon={<Pencil className="h-4 w-4" />} onClick={() => handleEdit(record)} />
                      </StorageTableActions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </>
          )}
        </AdminTableShell>
      </StoragePageShell>

      <StorageDrawer
        title={section.actionTitle}
        description={section.actionDescription}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <StorageReconciliationForm onCancel={handleDrawerClose} onSuccess={handleFormSuccess} initialData={editingRecord} />
      </StorageDrawer>
    </>
  );
}
