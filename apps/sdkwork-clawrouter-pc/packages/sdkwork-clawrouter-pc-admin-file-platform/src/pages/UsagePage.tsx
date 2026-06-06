import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, RefreshCw, Search } from 'lucide-react';
import { AdminTableShell } from 'sdkwork-clawrouter-pc-commons';
import { StoragePageShell } from '../components/StoragePageShell';
import { StorageEmptyState } from '../components/StorageEmptyState';
import {
  fetchStorageUsage,
  fetchStorageUsageLedgerRecords,
  fetchStorageUsageSnapshotRecords,
} from '../storageService';
import {
  STORAGE_SECTION_DEFINITIONS,
  type StorageColumn,
  type StorageRecord,
} from '../storageSectionDefinitions';

type UsageViewId = 'counters' | 'ledger' | 'snapshots';

const USAGE_VIEW_COLUMNS: Record<UsageViewId, StorageColumn[]> = {
  counters: [
    { key: 'scope', label: 'Scope' },
    { key: 'used', label: 'Used', align: 'right' },
    { key: 'reserved', label: 'Reserved', align: 'right' },
    { key: 'files', label: 'Files', align: 'right' },
    { key: 'snapshotAt', label: 'Snapshot' },
  ],
  ledger: [
    { key: 'scope', label: 'Scope' },
    { key: 'eventType', label: 'Event' },
    { key: 'used', label: 'Delta bytes', align: 'right' },
    { key: 'files', label: 'Delta files', align: 'right' },
    { key: 'snapshotAt', label: 'Occurred' },
  ],
  snapshots: [
    { key: 'scope', label: 'Scope' },
    { key: 'snapshotType', label: 'Type' },
    { key: 'used', label: 'Used', align: 'right' },
    { key: 'reserved', label: 'Reserved', align: 'right' },
    { key: 'snapshotAt', label: 'Snapshot' },
  ],
};

const USAGE_VIEW_OPTIONS: Array<{ id: UsageViewId; label: string }> = [
  { id: 'counters', label: 'Counters' },
  { id: 'ledger', label: 'Ledger' },
  { id: 'snapshots', label: 'Snapshots' },
];

export function UsagePage() {
  const { t } = useTranslation();
  const section = STORAGE_SECTION_DEFINITIONS.usage;
  const [activeUsageView, setActiveUsageView] = useState<UsageViewId>('counters');
  const [records, setRecords] = useState<StorageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await loadUsageRecords(activeUsageView);
      setRecords(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t('admin.filePlatform.storage.loadError', 'Failed to load records'));
    } finally {
      setIsLoading(false);
    }
  }, [activeUsageView, t]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await loadUsageRecords(activeUsageView);
      setRecords(data);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : t('admin.filePlatform.storage.refreshError', 'Failed to refresh usage'));
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      USAGE_VIEW_COLUMNS[activeUsageView].some((col) => String(r[col.key] ?? '').toLowerCase().includes(q)),
    );
  }, [activeUsageView, records, search]);

  const pagedRecords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, page, pageSize]);

  const hasNextPage = filteredRecords.length > page * pageSize;

  return (
    <StoragePageShell
      isLoading={isLoading}
      error={error}
      onRefresh={loadRecords}
      actions={(
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRefreshing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {section.buttonLabel}
        </button>
      )}
    >
        <AdminTableShell
          className="flex-1 min-h-0"
          viewportClassName="min-h-0 flex-1"
          header={(
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/10">
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
            <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 dark:border-white/10 dark:bg-white/5">
              {USAGE_VIEW_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setActiveUsageView(option.id);
                    setPage(1);
                  }}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                    activeUsageView === option.id
                      ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
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
          />
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                {USAGE_VIEW_COLUMNS[activeUsageView].map((column) => (
                  <th
                    className={`px-4 py-3 font-semibold ${column.align === 'right' ? 'text-right' : ''}`}
                    key={column.key}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {pagedRecords.map((record, index) => (
                <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={`${section.id}-${(page - 1) * pageSize + index}`}>
                  {USAGE_VIEW_COLUMNS[activeUsageView].map((column) => (
                    <td
                      className={`max-w-[260px] truncate px-4 py-3 ${column.align === 'right' ? 'text-right tabular-nums' : ''}`}
                      key={column.key}
                      title={record[column.key] || '-'}
                    >
                      {record[column.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableShell>
    </StoragePageShell>
  );
}

async function loadUsageRecords(activeUsageView: UsageViewId): Promise<StorageRecord[]> {
  if (activeUsageView === 'ledger') {
    return fetchStorageUsageLedgerRecords();
  }
  if (activeUsageView === 'snapshots') {
    return fetchStorageUsageSnapshotRecords();
  }
  return fetchStorageUsage();
}
