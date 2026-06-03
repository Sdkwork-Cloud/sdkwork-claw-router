import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Bot, Database, Eye, Folder, FolderTree, RefreshCw, Search, ServerCog, UserRound, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdminTableShell, BottomPagination, BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import {
  AdminAgentService,
  type AdminAgentItem,
  type AdminAgentListQuery,
  type AdminAgentPolicyDocument,
} from './agentService';

const statusOptions = ['active', 'disabled'] as const;
const visibilityOptions = ['private', 'organization', 'public'] as const;
type AdminAgentCategoryId = '' | 'active' | 'disabled' | 'memory' | 'mcp' | 'skills' | 'private' | 'organization' | 'public';
type AdminAgentCategory = { id: AdminAgentCategoryId; label: string; count: number; icon: ReactNode };

export function AdminAgentsView() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AdminAgentItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AdminAgentItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<AdminAgentCategoryId>('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [q, setQ] = useState('');
  const [ownerUserId, setOwnerUserId] = useState('');
  const [status, setStatus] = useState('');
  const [visibility, setVisibility] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('25');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const query = useMemo<AdminAgentListQuery>(() => {
    const nextQuery: AdminAgentListQuery = { page };
    const normalizedQ = q.trim();
    if (normalizedQ) {
      nextQuery.q = normalizedQ;
    }
    const normalizedOwnerUserId = Number(ownerUserId);
    if (ownerUserId.trim() && Number.isSafeInteger(normalizedOwnerUserId) && normalizedOwnerUserId > 0) {
      nextQuery.ownerUserId = normalizedOwnerUserId;
    }
    if (status === 'active' || status === 'disabled') {
      nextQuery.status = status;
    }
    if (visibility === 'private' || visibility === 'organization' || visibility === 'public') {
      nextQuery.visibility = visibility;
    }
    const normalizedPageSize = Number(pageSize);
    if (Number.isSafeInteger(normalizedPageSize) && normalizedPageSize > 0) {
      nextQuery.pageSize = normalizedPageSize;
    }
    return nextQuery;
  }, [ownerUserId, page, pageSize, q, status, visibility]);

  const loadAgents = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await AdminAgentService.listAgents(query);
      setAgents(items);
      setSelectedAgent((current) => {
        if (!current) {
          return null;
        }
        return items.find((item) => item.id === current.id || item.code === current.code) ?? current;
      });
    } catch (error) {
      setAgents([]);
      setSelectedAgent(null);
      setDetailsOpen(false);
      setLoadError(errorMessage(error, t('admin.agents.errors.loadFallback')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAgents();
  }, [query]);

  const openDetails = async (agent: AdminAgentItem) => {
    const agentId = agent.id || agent.code;
    setSelectedAgent(agent);
    setDetailsOpen(true);
    setDetailLoadingId(agentId);
    setDetailError(null);
    try {
      setSelectedAgent(await AdminAgentService.retrieveAgent(agentId));
    } catch (error) {
      setDetailError(errorMessage(error, t('admin.agents.errors.detailFallback')));
    } finally {
      setDetailLoadingId(null);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedAgent(null);
    setDetailError(null);
  };

  const resetFilters = () => {
    setQ('');
    setOwnerUserId('');
    setStatus('');
    setVisibility('');
    setPage(1);
    setPageSize('25');
  };

  const agentCategories = useMemo<AdminAgentCategory[]>(() => [
    {
      id: '',
      label: t('admin.agents.categories.all'),
      count: agents.length,
      icon: <Folder className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'active',
      label: t('admin.agents.categories.active'),
      count: agents.filter((agent) => agent.status === 'active').length,
      icon: <ServerCog className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'disabled',
      label: t('admin.agents.categories.disabled'),
      count: agents.filter((agent) => agent.status === 'disabled').length,
      icon: <X className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'memory',
      label: t('admin.agents.categories.memory'),
      count: agents.filter((agent) => agent.capabilities.memoryEnabled).length,
      icon: <Database className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'mcp',
      label: t('admin.agents.categories.mcp'),
      count: agents.filter((agent) => agent.capabilities.mcpServerCount > 0).length,
      icon: <ServerCog className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'skills',
      label: t('admin.agents.categories.skills'),
      count: agents.filter((agent) => agent.capabilities.skillBindingCount > 0).length,
      icon: <UserRound className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'private',
      label: t('admin.agents.categories.private'),
      count: agents.filter((agent) => agent.visibility === 'private').length,
      icon: <Folder className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'organization',
      label: t('admin.agents.categories.organization'),
      count: agents.filter((agent) => agent.visibility === 'organization').length,
      icon: <Folder className="h-4 w-4 shrink-0" />,
    },
    {
      id: 'public',
      label: t('admin.agents.categories.public'),
      count: agents.filter((agent) => agent.visibility === 'public').length,
      icon: <Folder className="h-4 w-4 shrink-0" />,
    },
  ], [agents, t]);

  const selectedCategoryName = agentCategories.find((category) => category.id === selectedCategoryId)?.label ?? t('admin.agents.categories.all');
  const filteredAgents = useMemo(
    () => agents.filter((agent) => matchesAgentCategory(agent, selectedCategoryId)),
    [agents, selectedCategoryId],
  );

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-4 overflow-hidden">
      <div data-admin-agent-layout className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-hidden xl:grid-cols-[320px_minmax(0,1fr)]">
        <AdminAgentCategoryTree
          categories={agentCategories}
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
          loading={loading}
          onSelect={setSelectedCategoryId}
        />

        <AdminTableShell
          data-admin-agent-table-card
          className="min-h-0 min-w-0 flex-1"
          viewportClassName="min-h-0 flex-1"
          viewportProps={{ 'data-admin-agent-table-viewport': true }}
          header={(
            <>
              <div className="border-b border-slate-200 p-3 dark:border-white/10">
                <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
                  <div className="relative min-w-0 xl:w-[320px]">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={q}
                      onChange={(event) => {
                        setPage(1);
                        setQ(event.target.value);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      placeholder={t('admin.agents.filters.searchPlaceholder')}
                    />
                  </div>
                  <input
                    value={ownerUserId}
                    onChange={(event) => {
                      setPage(1);
                      setOwnerUserId(event.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white xl:w-40"
                    placeholder={t('admin.agents.filters.ownerPlaceholder')}
                    inputMode="numeric"
                  />
                  <select
                    value={status}
                    onChange={(event) => {
                      setPage(1);
                      setStatus(event.target.value);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
                  >
                    <option value="">{t('admin.agents.filters.allStatuses')}</option>
                    {statusOptions.map((option) => <option key={option} value={option}>{t(`admin.agents.status.${option}`)}</option>)}
                  </select>
                  <select
                    value={visibility}
                    onChange={(event) => {
                      setPage(1);
                      setVisibility(event.target.value);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
                  >
                    <option value="">{t('admin.agents.filters.allVisibility')}</option>
                    {visibilityOptions.map((option) => <option key={option} value={option}>{t(`admin.agents.visibility.${option}`)}</option>)}
                  </select>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(event.target.value);
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
                    aria-label={t('admin.agents.filters.pageSize')}
                  >
                    {[10, 25, 50, 100].map((size) => <option key={size} value={String(size)}>{t('admin.agents.filters.pageSizeValue', { count: size })}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                    {t('common.actions.reset')}
                  </button>
                  <div className="inline-flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
                    <Folder className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="max-w-[220px] truncate">{selectedCategoryName}</span>
                  </div>
                </div>
              </div>

              {loadError ? (
                <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {loadError}
                </div>
              ) : null}
            </>
          )}
          footer={(
            <div data-admin-agent-pagination>
              <BottomPagination
                page={page}
                pageSize={Number(pageSize)}
                itemCount={filteredAgents.length}
                hasNextPage={filteredAgents.length >= Number(pageSize)}
                disabled={loading}
                showingLabel={t('admin.agents.pagination.showing')}
                pageLabel={t('admin.agents.pagination.page', { page })}
                pageSizeLabel={t('admin.agents.pagination.pageSize')}
                previousLabel={t('common.actions.previousPage')}
                nextLabel={t('common.actions.nextPage')}
                pageSizeOptions={[10, 25, 50, 100]}
                onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
                onNextPage={() => setPage((current) => current + 1)}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(String(nextPageSize));
                  setPage(1);
                }}
              />
            </div>
          )}
        >
          <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t('admin.agents.table.agent')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.agents.table.owner')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.agents.table.state')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.agents.table.runtime')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.agents.table.capabilities')}</th>
                  <th className="px-4 py-3 font-semibold">{t('admin.agents.table.updatedAt')}</th>
                  <th className="px-4 py-3 text-right font-semibold">{t('common.actions.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {loading ? (
                  <BusinessStateTableRow colSpan={7} kind="loading" title={t('admin.agents.loading')} />
                ) : agents.length === 0 ? (
                  <BusinessStateTableRow colSpan={7} kind="empty" title={t('admin.agents.emptyTitle')} description={t('admin.agents.emptyDescription')} />
                ) : filteredAgents.length === 0 ? (
                  <BusinessStateTableRow colSpan={7} kind="empty" title={t('admin.agents.emptyTitle')} description={selectedCategoryName} />
                ) : (
                  filteredAgents.map((agent) => (
                    <tr key={agent.id} className="align-top transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]">
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white">{agent.name}</div>
                            <div className="mt-1 max-w-[260px] truncate font-mono text-xs text-slate-500">{agent.code}</div>
                            {agent.description ? <div className="mt-1 max-w-[320px] truncate text-xs text-slate-500">{agent.description}</div> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">#{agent.ownerUserId}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge value={agent.status} label={t(`admin.agents.status.${agent.status}`)} />
                          <VisibilityBadge value={agent.visibility} label={t(`admin.agents.visibility.${agent.visibility}`)} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        <div className="font-mono text-xs">{agent.defaultVersion.model || '-'}</div>
                        <div className="mt-1 text-xs text-slate-500">{t(`admin.agents.releaseStatus.${agent.defaultVersion.releaseStatus}`)} v{agent.defaultVersion.versionNo}</div>
                      </td>
                      <td className="px-4 py-3">
                        <CapabilityPills agent={agent} labels={{
                          memory: t('admin.agents.capabilities.memory'),
                          enabled: t('admin.agents.capabilities.enabled'),
                          disabled: t('admin.agents.capabilities.disabled'),
                          mcp: t('admin.agents.capabilities.mcp'),
                          skills: t('admin.agents.capabilities.skills'),
                        }} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{formatDateTime(agent.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => { void openDetails(agent); }}
                            className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            {t('common.actions.details')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
          </table>
        </AdminTableShell>
      </div>

      <AgentDetailsDrawer
        open={detailsOpen}
        agent={selectedAgent}
        loading={Boolean(detailLoadingId)}
        error={detailError}
        onClose={closeDetails}
      />
    </div>
  );
}

function AdminAgentCategoryTree({
  categories,
  selectedCategoryId,
  selectedCategoryName,
  loading,
  onSelect,
}: {
  categories: AdminAgentCategory[];
  selectedCategoryId: AdminAgentCategoryId;
  selectedCategoryName: string;
  loading: boolean;
  onSelect: (categoryId: AdminAgentCategoryId) => void;
}) {
  const { t } = useTranslation();
  const totalCount = categories.find((category) => category.id === '')?.count ?? 0;

  return (
    <aside
      data-admin-agent-category-tree
      className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 p-3 dark:border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <FolderTree className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
            <span>{t('admin.agents.categories.title')}</span>
          </div>
          <div className="mt-1 truncate text-xs text-slate-500">
            {t('admin.agents.categories.selected', { name: selectedCategoryName })}
          </div>
        </div>
        {loading ? <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" /> : null}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {categories.map((category) => {
          const selected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id || 'all'}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`mb-1 flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                selected
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]'
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                {category.icon}
                <span className="truncate font-semibold">{category.label}</span>
              </span>
              <span className="rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                {t('admin.agents.categories.count', { count: category.count })}
              </span>
            </button>
          );
        })}
      </div>
      <div className="shrink-0 border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-white/10">
        {t('admin.agents.categories.total', { count: totalCount })}
      </div>
    </aside>
  );
}

function AgentDetailsDrawer({
  open,
  agent,
  loading,
  error,
  onClose,
}: {
  open: boolean;
  agent: AdminAgentItem | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  if (!open) {
    return null;
  }

  return (
    <div data-admin-agent-details-drawer className="fixed inset-0 z-50 flex justify-end bg-slate-950/35 backdrop-blur-[1px] dark:bg-black/50">
      <button
        type="button"
        aria-label={t('common.actions.closeDrawer')}
        className="hidden flex-1 cursor-default md:block"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-[520px] flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4 dark:border-white/10">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('admin.agents.details.title')}</h3>
            <p className="mt-1 truncate text-xs text-slate-500">{agent ? agent.code : t('admin.agents.details.noSelection')}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" /> : null}
            <button
              type="button"
              aria-label={t('common.actions.close')}
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error ? (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        ) : null}

        {agent ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-bold text-slate-900 dark:text-white">{agent.name}</div>
                  <div className="mt-1 truncate font-mono text-xs text-slate-500">{agent.id}</div>
                </div>
                <StatusBadge value={agent.status} label={t(`admin.agents.status.${agent.status}`)} />
              </div>
              <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {agent.description || t('admin.agents.empty.noDescription')}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <DetailItem label={t('admin.agents.fields.ownerUserId')} value={`#${agent.ownerUserId}`} />
              <DetailItem label={t('admin.agents.fields.visibility')} value={t(`admin.agents.visibility.${agent.visibility}`)} />
              <DetailItem label={t('admin.agents.fields.templateSource')} value={agent.templateSource || '-'} />
              <DetailItem label={t('admin.agents.fields.releaseStatus')} value={t(`admin.agents.releaseStatus.${agent.defaultVersion.releaseStatus}`)} />
              <DetailItem label={t('admin.agents.fields.createdAt')} value={formatDateTime(agent.createdAt)} />
              <DetailItem label={t('admin.agents.fields.updatedAt')} value={formatDateTime(agent.updatedAt)} />
            </dl>

            <section className="mt-4 rounded-lg border border-slate-200 dark:border-white/10">
              <div className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 dark:border-white/10 dark:text-white">
                {t('admin.agents.details.runtime')}
              </div>
              <div className="space-y-3 p-4">
                <DetailItem label={t('admin.agents.fields.model')} value={agent.defaultVersion.model || '-'} />
                <DetailItem label={t('admin.agents.fields.versionNo')} value={`v${agent.defaultVersion.versionNo}`} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('admin.agents.fields.systemPrompt')}</div>
                  <div className="mt-2 max-h-28 overflow-y-auto rounded-lg bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100">
                    {agent.defaultVersion.systemPrompt || '-'}
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-slate-200 dark:border-white/10">
              <div className="border-b border-slate-200 px-4 py-3 text-sm font-bold text-slate-900 dark:border-white/10 dark:text-white">
                {t('admin.agents.details.policies')}
              </div>
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                <PolicyBlock title={t('admin.agents.fields.toolPolicy')} value={agent.defaultVersion.toolPolicy} />
                <PolicyBlock title={t('admin.agents.fields.memoryPolicy')} value={agent.defaultVersion.memoryPolicy} />
                <PolicyBlock title={t('admin.agents.fields.mcpPolicy')} value={agent.defaultVersion.mcpPolicy} />
                <PolicyBlock title={t('admin.agents.fields.skillPolicy')} value={agent.defaultVersion.skillPolicy} />
                <PolicyBlock title={t('admin.agents.fields.runtimePolicy')} value={agent.defaultVersion.runtimePolicy} />
              </div>
            </section>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-slate-500">
            {t('admin.agents.details.noSelection')}
          </div>
        )}
      </aside>
    </div>
  );
}

function matchesAgentCategory(agent: AdminAgentItem, categoryId: AdminAgentCategoryId): boolean {
  if (!categoryId) {
    return true;
  }
  if (categoryId === 'active' || categoryId === 'disabled') {
    return agent.status === categoryId;
  }
  if (categoryId === 'memory') {
    return agent.capabilities.memoryEnabled;
  }
  if (categoryId === 'mcp') {
    return agent.capabilities.mcpServerCount > 0;
  }
  if (categoryId === 'skills') {
    return agent.capabilities.skillBindingCount > 0;
  }
  return agent.visibility === categoryId;
}

function StatusBadge({ value, label }: { value: AdminAgentItem['status']; label: string }) {
  const tone = value === 'active'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
    : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300';
  return <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}>{label}</span>;
}

function VisibilityBadge({ value, label }: { value: AdminAgentItem['visibility']; label: string }) {
  const tone = value === 'public'
    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
    : value === 'organization'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
      : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300';
  return <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>{label}</span>;
}

function CapabilityPills({
  agent,
  labels,
}: {
  agent: AdminAgentItem;
  labels: { memory: string; enabled: string; disabled: string; mcp: string; skills: string };
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">
        {labels.memory} {agent.capabilities.memoryEnabled ? labels.enabled : labels.disabled}
      </span>
      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
        {labels.mcp} {agent.capabilities.mcpServerCount}
      </span>
      <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
        {labels.skills} {agent.capabilities.skillBindingCount}
      </span>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-sm text-slate-700 dark:text-slate-200">{value}</dd>
    </div>
  );
}

function PolicyBlock({ title, value }: { title: string; value: AdminAgentPolicyDocument }) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/[0.03]">
        <span>{title}</span>
      </summary>
      <pre className="max-h-56 overflow-auto border-t border-slate-200 bg-slate-950 p-4 text-xs leading-5 text-slate-100 dark:border-white/10">
        {JSON.stringify(value, null, 2)}
      </pre>
    </details>
  );
}

function formatDateTime(value: string): string {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
