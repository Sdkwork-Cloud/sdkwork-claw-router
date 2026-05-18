import React, { useEffect, useMemo, useState } from 'react';
import {
  Bot,
  Edit2,
  FileText,
  FolderPlus,
  ListFilter,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BusinessStatePanel, BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import {
  AgentService,
  type AgentDefinition,
  type CreateAgentInput,
} from './agentService';

type DrawerState =
  | { type: 'category-create' }
  | { type: 'agent-create' }
  | { type: 'agent-detail'; agentId: string }
  | { type: 'agent-edit'; agentId: string }
  | { type: 'agent-delete'; agentId: string }
  | null;

type AgentCategoryKey = 'all' | 'active' | 'draft' | 'memory' | 'mcp' | 'skills';

interface AgentCategoryNavItem {
  id: string;
  label: string;
  count: number;
}

interface AgentCreateFormValues {
  name: string;
  code: string;
  model: string;
  description: string;
  systemPrompt: string;
  memoryEnabled: boolean;
  mcpServers: string;
  skills: string;
  executionMode: string;
}

const agentCategories: { key: AgentCategoryKey; labelKey: string }[] = [
  { key: 'all', labelKey: 'console.agents.categories.all' },
  { key: 'active', labelKey: 'console.agents.categories.active' },
  { key: 'draft', labelKey: 'console.agents.categories.draft' },
  { key: 'memory', labelKey: 'console.agents.categories.memory' },
  { key: 'mcp', labelKey: 'console.agents.categories.mcp' },
  { key: 'skills', labelKey: 'console.agents.categories.skills' },
];

const initialCreateForm = {
  name: '',
  code: '',
  model: '',
  description: '',
  systemPrompt: '',
  memoryEnabled: true,
  mcpServers: '',
  skills: '',
  executionMode: 'interactive',
};

export function AgentsView() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AgentDefinition[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [drawerState, setDrawerState] = useState<DrawerState>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customCategories, setCustomCategories] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await AgentService.listAgents({ page: 1, pageSize: 100 });
      setAgents(items);
      setSelectedAgentId((current) => {
        if (current && items.some((agent) => agent.id === current)) {
          return current;
        }
        return items[0]?.id ?? null;
      });
    } catch (error) {
      setLoadError(errorMessage(error, t('console.agents.errors.loadFailed')));
      setAgents([]);
      setSelectedAgentId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAgents();
  }, []);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) ?? null;

  const filteredAgents = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return agents.filter((agent) => {
      if (!matchesCategory(agent, activeCategory)) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      return [
        agent.name,
        agent.code,
        agent.description,
        agent.defaultVersion.model ?? '',
      ].join(' ').toLowerCase().includes(normalizedSearch);
    });
  }, [activeCategory, agents, searchQuery]);

  const loadAgentDetail = async (agentId: string) => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const detail = await AgentService.retrieveAgent(agentId);
      setAgents((items) => items.map((item) => item.id === detail.id ? detail : item));
    } catch (error) {
      setDetailError(errorMessage(error, t('console.agents.errors.detailLoadFailed')));
    } finally {
      setDetailLoading(false);
    }
  };

  const openAgentDetail = (agent: AgentDefinition) => {
    setSelectedAgentId(agent.id);
    setDrawerState({ type: 'agent-detail', agentId: agent.id });
    void loadAgentDetail(agent.id || agent.code);
  };

  const handleCreateAgent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    const form = createAgentFormValues(new FormData(event.currentTarget));
    const agentName = form.name.trim();
    if (!agentName) {
      setActionError(t('console.agents.errors.nameRequired'));
      return;
    }
    const input = createAgentInputFromForm(form);
    setSubmitting(true);
    setActionError(null);
    try {
      const created = await AgentService.createAgent(input);
      setAgents((items) => [created, ...items]);
      setSelectedAgentId(created.id);
      setDrawerState({ type: 'agent-detail', agentId: created.id });
    } catch (error) {
      setActionError(errorMessage(error, t('console.agents.errors.createFailed')));
    } finally {
      setSubmitting(false);
    }
  };

  const categoryCounts = useMemo(() => {
    return Object.fromEntries(
      agentCategories.map((category) => [
        category.key,
        agents.filter((agent) => matchesCategory(agent, category.key)).length,
      ]),
    ) as Record<string, number>;
  }, [agents]);

  const categoryItems = useMemo<AgentCategoryNavItem[]>(() => [
    ...agentCategories.map((category) => ({
      id: category.key,
      label: t(category.labelKey),
      count: categoryCounts[category.key] ?? 0,
    })),
    ...customCategories.map((category) => ({
      id: category.id,
      label: category.name || t('console.agents.categories.customFallback'),
      count: 0,
    })),
  ], [categoryCounts, customCategories, t]);

  const handleCreateCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formValue(formData, 'categoryName').trim();
    if (!name) {
      setActionError(t('console.agents.errors.categoryNameRequired'));
      return;
    }
    const id = `custom-${Date.now()}`;
    setCustomCategories((items) => [
      ...items,
      {
        id,
        name,
        description: formValue(formData, 'categoryDescription').trim(),
      },
    ]);
    setActiveCategory(id);
    setActionError(null);
    setDrawerState(null);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 p-4 text-slate-900 dark:bg-[#121212] dark:text-white lg:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold lg:text-2xl">
            <Bot className="h-6 w-6 text-emerald-500" />
            {t('console.agents.title', '智能体管理')}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('console.agents.summary.count', { count: agents.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDrawerState({ type: 'agent-create' })}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          {t('console.agents.create.title', '创建智能体')}
        </button>
      </div>

      <div className="grid min-h-[640px] grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <AgentCategorySidebar
          activeCategory={activeCategory}
          categories={categoryItems}
          onCategoryChange={setActiveCategory}
          onCreateCategory={() => setDrawerState({ type: 'category-create' })}
        />

        <section className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#252525]">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <ListFilter className="h-4 w-4 text-emerald-500" />
              {t('console.agents.table.title')}
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                placeholder={t('console.agents.searchPlaceholder')}
              />
            </div>
          </div>

          {loadError ? (
            <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {loadError}
            </div>
          ) : null}

          <AgentTable
            agents={filteredAgents}
            loading={loading}
            selectedAgentId={selectedAgentId}
            emptyDescription={agents.length === 0 ? t('console.agents.states.emptyDescription') : t('console.agents.states.noSearchResult')}
            onSelect={(agent) => setSelectedAgentId(agent.id)}
            onDetail={(agent) => void openAgentDetail(agent)}
            onEdit={(agent) => {
              setSelectedAgentId(agent.id);
              setDrawerState({ type: 'agent-edit', agentId: agent.id });
            }}
            onDelete={(agent) => {
              setSelectedAgentId(agent.id);
              setDrawerState({ type: 'agent-delete', agentId: agent.id });
            }}
          />
        </section>
      </div>

      <AgentDrawer
        state={drawerState}
        selectedAgent={selectedAgent}
        detailLoading={detailLoading}
        detailError={detailError}
        actionError={actionError}
        submitting={submitting}
        onRetryDetail={() => selectedAgentId ? void loadAgentDetail(selectedAgentId) : undefined}
        onClose={() => {
          setDrawerState(null);
          setActionError(null);
          setDetailError(null);
        }}
        onCreateAgent={handleCreateAgent}
        onCreateCategory={handleCreateCategory}
      />
    </div>
  );
}

function AgentCategorySidebar({
  activeCategory,
  categories,
  onCategoryChange,
  onCreateCategory,
}: {
  activeCategory: string;
  categories: AgentCategoryNavItem[];
  onCategoryChange: (category: string) => void;
  onCreateCategory: () => void;
}) {
  const { t } = useTranslation();
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-[#252525]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">{t('console.agents.categories.title')}</h2>
        <button
          type="button"
          onClick={onCreateCategory}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:text-slate-300"
          title={t('console.agents.categories.add')}
          aria-label={t('console.agents.categories.add')}
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
            }`}
          >
            <span className="min-w-0 truncate">{category.label}</span>
            <span className="rounded bg-white px-1.5 py-0.5 text-[11px] text-slate-500 dark:bg-white/10 dark:text-slate-300">
              {category.count}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function AgentTable({
  agents,
  loading,
  selectedAgentId,
  emptyDescription,
  onSelect,
  onDetail,
  onEdit,
  onDelete,
}: {
  agents: AgentDefinition[];
  loading: boolean;
  selectedAgentId: string | null;
  emptyDescription: string;
  onSelect: (agent: AgentDefinition) => void;
  onDetail: (agent: AgentDefinition) => void;
  onEdit: (agent: AgentDefinition) => void;
  onDelete: (agent: AgentDefinition) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
          <tr>
            <th className="px-4 py-3 font-semibold">{t('console.agents.table.agent')}</th>
            <th className="px-4 py-3 font-semibold">{t('console.agents.table.model')}</th>
            <th className="px-4 py-3 font-semibold">{t('console.agents.table.status')}</th>
            <th className="px-4 py-3 font-semibold">{t('console.agents.table.capabilities')}</th>
            <th className="px-4 py-3 font-semibold">{t('console.agents.table.updated')}</th>
            <th className="px-4 py-3 text-right font-semibold">{t('console.agents.table.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {loading ? (
            <BusinessStateTableRow colSpan={6} kind="loading" title={t('console.agents.states.loading')} />
          ) : agents.length === 0 ? (
            <BusinessStateTableRow colSpan={6} kind="empty" title={t('console.agents.states.empty')} description={emptyDescription} />
          ) : (
            agents.map((agent) => (
              <tr
                key={agent.id}
                onClick={() => onSelect(agent)}
                className={`cursor-pointer align-top transition-colors ${
                  selectedAgentId === agent.id
                    ? 'bg-emerald-50/60 dark:bg-emerald-500/10'
                    : 'hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white">{agent.name}</div>
                      <div className="mt-1 max-w-[260px] truncate font-mono text-xs text-slate-500">{agent.code}</div>
                      <div className="mt-1 max-w-[320px] truncate text-xs text-slate-500">{agent.description || '-'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{agent.defaultVersion.model || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <Badge>{t(`console.agents.status.${agent.status}`)}</Badge>
                    <Badge>{t(`console.agents.releaseStatus.${agent.defaultVersion.releaseStatus}`)}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge>{t('console.agents.detail.memory')}: {agent.capabilities.memoryEnabled ? t('console.agents.value.enabled') : t('console.agents.value.disabled')}</Badge>
                    <Badge>MCP {agent.capabilities.mcpServerCount}</Badge>
                    <Badge>{t('console.agents.detail.skills')} {agent.capabilities.skillBindingCount}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{formatDateTime(agent.updatedAt)}</td>
                <td className="px-4 py-3">
                  <AgentActionButtons
                    onDetail={() => onDetail(agent)}
                    onEdit={() => onEdit(agent)}
                    onDelete={() => onDelete(agent)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function AgentActionButtons({
  onDetail,
  onEdit,
  onDelete,
}: {
  onDetail: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
      <IconButton title={t('console.agents.actions.detail')} onClick={onDetail} icon={<FileText className="h-4 w-4" />} />
      <IconButton title={t('console.agents.actions.edit')} onClick={onEdit} icon={<Edit2 className="h-4 w-4" />} />
      <IconButton title={t('console.agents.actions.delete')} onClick={onDelete} icon={<Trash2 className="h-4 w-4" />} danger />
    </div>
  );
}

function AgentDrawer({
  state,
  selectedAgent,
  detailLoading,
  detailError,
  actionError,
  submitting,
  onRetryDetail,
  onClose,
  onCreateAgent,
  onCreateCategory,
}: {
  state: DrawerState;
  selectedAgent: AgentDefinition | null;
  detailLoading: boolean;
  detailError: string | null;
  actionError: string | null;
  submitting: boolean;
  onRetryDetail: () => void | undefined;
  onClose: () => void;
  onCreateAgent: (event: React.FormEvent<HTMLFormElement>) => void;
  onCreateCategory: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  if (!state) {
    return null;
  }

  const title = drawerTitle(state, t);
  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/45 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute left-0 top-0 flex h-full w-full max-w-2xl animate-in slide-in-from-left flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {actionError ? (
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {actionError}
            </div>
          ) : null}
          {state.type === 'agent-create' ? (
            <AgentCreateForm submitting={submitting} onSubmit={onCreateAgent} />
          ) : state.type === 'category-create' ? (
            <CategoryCreateForm onSubmit={onCreateCategory} />
          ) : state.type === 'agent-edit' || state.type === 'agent-delete' ? (
            <UnsupportedAction agent={selectedAgent} />
          ) : detailLoading ? (
            <BusinessStatePanel kind="loading" title={t('console.agents.states.detailLoading')} className="min-h-[360px]" />
          ) : detailError ? (
            <BusinessStatePanel
              kind="error"
              title={t('console.agents.states.detailLoadError')}
              description={detailError}
              onRetry={() => void onRetryDetail()}
              retryLabel={t('common.actions.retry')}
              className="min-h-[360px]"
            />
          ) : selectedAgent ? (
            <AgentDetails agent={selectedAgent} />
          ) : (
            <BusinessStatePanel kind="empty" title={t('console.agents.states.noSelection')} description={t('console.agents.states.noSelectionDescription')} className="min-h-[360px]" />
          )}
        </div>
      </div>
    </div>
  );
}

function AgentCreateForm({
  submitting,
  onSubmit,
}: {
  submitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label={t('console.agents.form.name')} name="name" defaultValue={initialCreateForm.name} required />
      <Field label={t('console.agents.form.code')} name="code" defaultValue={initialCreateForm.code} />
      <Field label={t('console.agents.form.model')} name="model" defaultValue={initialCreateForm.model} />
      <TextArea label={t('console.agents.form.description')} name="description" defaultValue={initialCreateForm.description} rows={3} />
      <TextArea label={t('console.agents.form.systemPrompt')} name="systemPrompt" defaultValue={initialCreateForm.systemPrompt} rows={6} />
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input name="memoryEnabled" type="checkbox" defaultChecked={initialCreateForm.memoryEnabled} className="h-4 w-4 rounded border-slate-300 text-emerald-600" />
        {t('console.agents.form.memory')}
      </label>
      <Field label={t('console.agents.form.mcpServers')} name="mcpServers" defaultValue={initialCreateForm.mcpServers} />
      <Field label={t('console.agents.form.skills')} name="skills" defaultValue={initialCreateForm.skills} />
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('console.agents.form.executionMode')}</span>
        <select name="executionMode" defaultValue={initialCreateForm.executionMode} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-[#202020] dark:text-white">
          <option value="interactive">{t('console.agents.executionMode.interactive')}</option>
          <option value="autonomous">{t('console.agents.executionMode.autonomous')}</option>
          <option value="review_required">{t('console.agents.executionMode.reviewRequired')}</option>
        </select>
      </label>
      <button type="submit" disabled={submitting} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {t('console.agents.create.submit')}
      </button>
    </form>
  );
}

function AgentDetails({ agent }: { agent: AgentDefinition }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="text-lg font-bold text-slate-900 dark:text-white">{agent.name}</div>
        <div className="mt-1 font-mono text-xs text-slate-500">{agent.code}</div>
        <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{agent.description || t('console.agents.value.unset')}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Detail label={t('console.agents.detail.model')} value={agent.defaultVersion.model || t('console.agents.value.unset')} />
        <Detail label={t('console.agents.detail.memory')} value={agent.capabilities.memoryEnabled ? t('console.agents.value.enabled') : t('console.agents.value.disabled')} />
        <Detail label={t('console.agents.detail.mcpServers')} value={String(agent.capabilities.mcpServerCount)} />
        <Detail label={t('console.agents.detail.skills')} value={String(agent.capabilities.skillBindingCount)} />
      </div>
      <Policy title={t('console.agents.detail.systemPrompt')} value={agent.defaultVersion.systemPrompt || t('console.agents.value.unset')} />
      <Policy title={t('console.agents.detail.memoryPolicy')} value={formatJson(agent.defaultVersion.memoryPolicy)} />
      <Policy title={t('console.agents.detail.mcpPolicy')} value={formatJson(agent.defaultVersion.mcpPolicy)} />
      <Policy title={t('console.agents.detail.skillPolicy')} value={formatJson(agent.defaultVersion.skillPolicy)} />
      <Policy title={t('console.agents.detail.toolPolicy')} value={formatJson(agent.defaultVersion.toolPolicy)} />
      <Policy title={t('console.agents.detail.runtimePolicy')} value={formatJson(agent.defaultVersion.runtimePolicy)} />
    </div>
  );
}

function CategoryCreateForm({ onSubmit }: { onSubmit: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const { t } = useTranslation();
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label={t('console.agents.categories.name')} name="categoryName" />
      <TextArea label={t('console.agents.categories.description')} name="categoryDescription" rows={4} />
      <button type="submit" className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
        <FolderPlus className="h-4 w-4" />
        {t('console.agents.categories.submit')}
      </button>
    </form>
  );
}

function UnsupportedAction({ agent }: { agent: AgentDefinition | null }) {
  const { t } = useTranslation();
  return (
    <BusinessStatePanel
      kind="empty"
      title={agent?.name ?? t('console.agents.states.noSelection')}
      description={t('console.agents.errors.actionUnsupported')}
      className="min-h-[360px]"
    />
  );
}

function Field({ label, name, defaultValue = '', required = false }: { label: string; name: string; defaultValue?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

function TextArea({ label, name, defaultValue = '', rows }: { label: string; name: string; defaultValue?: string; rows: number }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

function IconButton({ title, icon, danger = false, onClick }: { title: string; icon: React.ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10'
          : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300'
      }`}
    >
      {icon}
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex w-fit rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">{children}</span>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm text-slate-700 dark:text-slate-200">{value}</div>
    </div>
  );
}

function Policy({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-slate-200 dark:border-white/10">
      <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold dark:border-white/10">{title}</div>
      <pre className="max-h-48 overflow-auto bg-slate-950 p-3 text-xs leading-5 text-slate-100">{value}</pre>
    </section>
  );
}

function matchesCategory(agent: AgentDefinition, category: string): boolean {
  if (category === 'all') {
    return true;
  }
  if (category === 'active') {
    return agent.status === 'active';
  }
  if (category === 'draft') {
    return agent.defaultVersion.releaseStatus === 'draft';
  }
  if (category === 'memory') {
    return agent.capabilities.memoryEnabled;
  }
  if (category === 'mcp') {
    return agent.capabilities.mcpServerCount > 0;
  }
  if (category === 'skills') {
    return agent.capabilities.skillBindingCount > 0;
  }
  return false;
}

function createAgentFormValues(formData: FormData): AgentCreateFormValues {
  return {
    name: formValue(formData, 'name'),
    code: formValue(formData, 'code'),
    model: formValue(formData, 'model'),
    description: formValue(formData, 'description'),
    systemPrompt: formValue(formData, 'systemPrompt'),
    memoryEnabled: formData.get('memoryEnabled') === 'on',
    mcpServers: formValue(formData, 'mcpServers'),
    skills: formValue(formData, 'skills'),
    executionMode: formValue(formData, 'executionMode'),
  };
}

function createAgentInputFromForm(form: AgentCreateFormValues): CreateAgentInput {
  return {
    name: form.name,
    code: form.code,
    model: form.model,
    description: form.description,
    systemPrompt: form.systemPrompt,
    memoryEnabled: form.memoryEnabled,
    mcpServers: commaSeparated(form.mcpServers),
    skills: commaSeparated(form.skills),
    executionMode: form.executionMode,
  };
}

function formValue(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
}

function commaSeparated(value: string): string[] {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function drawerTitle(state: DrawerState, t: ReturnType<typeof useTranslation>['t']): string {
  if (!state) {
    return '';
  }
  if (state.type === 'category-create') {
    return t('console.agents.categories.createTitle');
  }
  if (state.type === 'agent-create') {
    return t('console.agents.create.title');
  }
  if (state.type === 'agent-edit') {
    return t('console.agents.edit.title');
  }
  if (state.type === 'agent-delete') {
    return t('console.agents.delete.title');
  }
  return t('console.agents.actions.detail');
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

function formatJson(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}

function errorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }
  return error.message.startsWith('console.') ? fallback : error.message;
}
