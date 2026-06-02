import React, { useEffect, useState } from 'react';
import { AdminTableShell, BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import { Plus, Search, Trash2, Edit, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, ArrowUpDown, Settings, LayoutGrid, X, Link2, Save } from 'lucide-react';
import { GroupService, type GroupChannelBindingData, type GroupChannelBindingInput, type GroupChannelOption, type GroupData } from './groupService';
import { createGroupInputFromForm, createGroupUpdateInputFromForm } from './groupForm';
import { useTranslation } from 'react-i18next';

const CHANNEL_PICKER_PAGE_SIZE = 12;

export function GroupAdmin() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null);
  const [priceReferenceMode, setPriceReferenceMode] = useState<GroupData['priceReferenceMode']>('multiplier');
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupData | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [channelBindingTarget, setChannelBindingTarget] = useState<GroupData | null>(null);
  const [channelBindings, setChannelBindings] = useState<GroupChannelBindingData[]>([]);
  const [channelOptions, setChannelOptions] = useState<GroupChannelOption[]>([]);
  const [bindingDraft, setBindingDraft] = useState<Record<string, GroupChannelBindingInput>>({});
  const [bindingLoading, setBindingLoading] = useState(false);
  const [bindingSaving, setBindingSaving] = useState(false);
  const [bindingError, setBindingError] = useState<string | null>(null);
  const [bindingSearchQuery, setBindingSearchQuery] = useState('');
  const [isChannelPickerOpen, setIsChannelPickerOpen] = useState(false);
  const [pickerSearchQuery, setPickerSearchQuery] = useState('');
  const [pickerSelection, setPickerSelection] = useState<Record<string, boolean>>({});
  const [pickerPage, setPickerPage] = useState(1);
  const groupSelectClassName = 'w-full rounded-lg border border-slate-300 bg-white pl-3 pr-10 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white dark:focus:border-emerald-500 appearance-none cursor-pointer';
  const groupOptionClassName = 'bg-white text-slate-900 dark:bg-[#202020] dark:text-white';

  const loadGroups = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await GroupService.fetchGroups();
      setGroups(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGroups();
  }, []);

  const platformOptions = Array.from(new Set(groups.map(group => group.providerCode).filter(Boolean))).sort();

  const filteredGroups = groups
    .filter(group => group.groupName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(group => !platformFilter || group.providerCode === platformFilter)
    .filter(group => !statusFilter || group.status === statusFilter)
    .filter(group => !typeFilter || group.groupType === typeFilter)
    .sort((left, right) => {
      const result = left.groupName.localeCompare(right.groupName);
      return sortDirection === 'asc' ? result : -result;
    });

  const openCreateModal = () => {
    setEditingGroup(null);
    setPriceReferenceMode('multiplier');
    setIsModalOpen(true);
  };

  const openEditModal = (group: GroupData) => {
    setEditingGroup(group);
    setPriceReferenceMode(group.priceReferenceMode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setIsModalOpen(false);
    setEditingGroup(null);
    setPriceReferenceMode('multiplier');
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setSaving(true);
    try {
      if (editingGroup) {
        const updated = await GroupService.updateGroup(editingGroup.id, createGroupUpdateInputFromForm(formData));
        setGroups(current => current.map(group => group.id === updated.id ? updated : group));
      } else {
        const added = await GroupService.addGroup(createGroupInputFromForm(formData));
        setGroups(current => [added, ...current]);
      }
      setIsModalOpen(false);
      setEditingGroup(null);
      setLoadError(null);
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteConfirmation = () => {
    if (deletingGroupId) {
      return;
    }
    setDeleteTarget(null);
  };

  const executeDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setDeletingGroupId(id);
    try {
      const success = await GroupService.deleteGroup(id);
      if (success) {
        setGroups(current => current.filter(g => g.id !== id));
      }
      setDeleteTarget(null);
    } finally {
      setDeletingGroupId(null);
    }
  };

  const openChannelBindingModal = async (group: GroupData) => {
    setChannelBindingTarget(group);
    setBindingLoading(true);
    setBindingSaving(false);
    setBindingError(null);
    setChannelBindings([]);
    setChannelOptions([]);
    setBindingDraft({});
    setBindingSearchQuery('');
    setIsChannelPickerOpen(false);
    setPickerSearchQuery('');
    setPickerSelection({});
    try {
      const [channels, bindings] = await Promise.all([
        GroupService.fetchAssignableChannels(),
        GroupService.fetchGroupChannelBindings(group.id),
      ]);
      setChannelOptions(channels);
      setChannelBindings(bindings);
      setBindingDraft(bindingsToDraft(bindings));
    } catch (error) {
      setBindingError(error instanceof Error ? error.message : t('admin.group.channelBindings.errors.load'));
    } finally {
      setBindingLoading(false);
    }
  };

  const closeChannelBindingModal = () => {
    if (bindingSaving) {
      return;
    }
    setChannelBindingTarget(null);
    setChannelBindings([]);
    setChannelOptions([]);
    setBindingDraft({});
    setBindingError(null);
    setBindingSearchQuery('');
    setIsChannelPickerOpen(false);
    setPickerSearchQuery('');
    setPickerSelection({});
    setPickerPage(1);
  };

  const openChannelBindingPicker = () => {
    setPickerSearchQuery('');
    setPickerSelection({});
    setPickerPage(1);
    setIsChannelPickerOpen(true);
  };

  const closeChannelBindingPicker = () => {
    setIsChannelPickerOpen(false);
    setPickerSearchQuery('');
    setPickerSelection({});
    setPickerPage(1);
  };

  const isChannelAlreadyBound = (channelId: string) => Boolean(bindingDraft[channelId]);

  const togglePickerSelection = (channelId: string) => {
    if (isChannelAlreadyBound(channelId)) {
      return;
    }
    setPickerSelection(current => ({ ...current, [channelId]: !current[channelId] }));
  };

  const addSelectedChannelBindings = () => {
    const selectedIds = Object.entries(pickerSelection)
      .filter(([channelId, selected]) => selected && !isChannelAlreadyBound(channelId))
      .map(([channelId]) => channelId);

    if (selectedIds.length === 0) {
      return;
    }

    setBindingDraft(current => {
      const next = { ...current };
      for (const channelId of selectedIds) {
        if (next[channelId]) {
          continue;
        }
        const channel = channelOptions.find(option => option.id === channelId);
        if (!channel) {
          continue;
        }
        next[channel.id] = {
          channelId: channel.id,
          priority: 100,
          weight: 100,
          status: 'active',
          modelScope: [],
          capabilities: channel.capabilities,
        };
      }
      return next;
    });
    closeChannelBindingPicker();
  };

  const removeChannelBindingDraft = (channelId: string) => {
    setBindingDraft(current => {
      if (!current[channelId]) {
        return current;
      }
      const next = { ...current };
      delete next[channelId];
      return next;
    });
  };

  const updateChannelBindingDraft = (channelId: string, patch: Partial<GroupChannelBindingInput>) => {
    setBindingDraft(current => {
      const existing = current[channelId];
      if (!existing) {
        return current;
      }
      return { ...current, [channelId]: { ...existing, ...patch } };
    });
  };

  const saveChannelBindings = async () => {
    if (!channelBindingTarget) {
      return;
    }
    setBindingSaving(true);
    setBindingError(null);
    try {
      const saved = await GroupService.replaceGroupChannelBindings(
        channelBindingTarget.id,
        Object.values(bindingDraft).sort((left, right) => {
          const priority = (left.priority ?? 100) - (right.priority ?? 100);
          return priority !== 0 ? priority : (right.weight ?? 100) - (left.weight ?? 100);
        }),
      );
      setChannelBindings(saved);
      setBindingDraft(bindingsToDraft(saved));
      closeChannelBindingModal();
    } catch (error) {
      setBindingError(error instanceof Error ? error.message : t('admin.group.channelBindings.errors.save'));
    } finally {
      setBindingSaving(false);
    }
  };

  const selectedBindingCount = Object.keys(bindingDraft).length;
  const selectedPickerCount = Object.entries(pickerSelection)
    .filter(([channelId, selected]) => selected && !isChannelAlreadyBound(channelId))
    .length;
  const channelOptionById = new Map(channelOptions.map(channel => [channel.id, channel]));
  const bindingByChannelId = new Map(channelBindings.map(binding => [binding.channelId, binding]));
  const visibleBindingRows = Object.values(bindingDraft)
    .map(draft => {
      const persisted = bindingByChannelId.get(draft.channelId);
      const option = channelOptionById.get(draft.channelId);
      return {
        channelId: draft.channelId,
        channelName: persisted?.channelName ?? option?.name ?? draft.channelId,
        providerCode: persisted?.providerCode ?? option?.providerCode ?? 'unknown',
        providerName: persisted?.providerName ?? option?.providerName ?? 'unknown',
        channelCode: persisted?.channelCode ?? option?.channelCode ?? draft.channelId,
        models: persisted?.models ?? option?.models ?? [],
        capabilities: draft.capabilities ?? persisted?.capabilities ?? option?.capabilities ?? [],
        modelScope: draft.modelScope ?? persisted?.modelScope ?? [],
        priority: draft.priority ?? persisted?.priority ?? 100,
        weight: draft.weight ?? persisted?.weight ?? 100,
        status: draft.status ?? persisted?.status ?? 'active',
        healthStatus: persisted?.healthStatus ?? option?.healthStatus ?? 'active',
      };
    })
    .filter(row => matchesChannelSearch(bindingSearchQuery, [
      row.channelName,
      row.channelCode,
      row.providerName,
      row.providerCode,
      ...row.models,
      ...row.capabilities,
    ]))
    .sort((left, right) => {
      const priority = left.priority - right.priority;
      return priority !== 0 ? priority : right.weight - left.weight;
    });
  const pickerChannelOptions = channelOptions
    .filter(channel => matchesChannelSearch(pickerSearchQuery, [
      channel.name,
      channel.channelCode,
      channel.providerName,
      channel.providerCode,
      ...channel.models,
      ...channel.capabilities,
    ]))
    .sort((left, right) => `${left.providerName} ${left.name}`.localeCompare(`${right.providerName} ${right.name}`));
  const addableChannelCount = pickerChannelOptions.filter(channel => !isChannelAlreadyBound(channel.id)).length;
  const pickerTotalPages = Math.max(1, Math.ceil(pickerChannelOptions.length / CHANNEL_PICKER_PAGE_SIZE));
  const paginatedPickerChannelOptions = pickerChannelOptions.slice(
    (pickerPage - 1) * CHANNEL_PICKER_PAGE_SIZE,
    pickerPage * CHANNEL_PICKER_PAGE_SIZE,
  );
  const pickerStartIndex = pickerChannelOptions.length === 0
    ? 0
    : (pickerPage - 1) * CHANNEL_PICKER_PAGE_SIZE + 1;
  const pickerEndIndex = Math.min(pickerChannelOptions.length, pickerPage * CHANNEL_PICKER_PAGE_SIZE);

  useEffect(() => {
    setPickerPage(current => Math.min(Math.max(current, 1), pickerTotalPages));
  }, [pickerTotalPages]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden">
      <div className="flex shrink-0 flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t("admin.group.index.text.1y74ql", "Search channel groups...")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-[200px] text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-pointer w-[140px]">
              <option value="">{t("admin.group.index.text.1u2mbem", "All providers")}</option>
              {platformOptions.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-pointer w-[140px]">
              <option value="">{t("admin.group.index.text.igzce8", "All statuses")}</option>
              <option value="active">{t("admin.group.index.text.tt5vxa", "active")}</option>
              <option value="disabled">{t("admin.group.index.text.1uz4mvb", "disabled")}</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-pointer w-[140px]">
              <option value="">{t("admin.group.index.text.75150v", "All group types")}</option>
              <option value="public">{t("admin.group.index.text.q3pv0x", "public")}</option>
              <option value="dedicated">{t("admin.group.index.text.1wiizn8", "dedicated")}</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto xl:ml-0">
          <button onClick={() => { void loadGroups(); }} className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setSortDirection(current => current === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <ArrowUpDown className="w-4 h-4" /> {t("admin.group.index.text.dqvmz2", "Sort")}
          </button>
          <button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> {t("admin.group.index.text.1fp7vgi", "Create group")}
          </button>
        </div>
      </div>

      <AdminTableShell
        data-admin-group-table-card
        className="rounded-xl dark:bg-[#1a1a1a]"
        header={loadError && groups.length > 0 ? (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            <div className="font-semibold">{t('admin.group.state.loadErrorTitle')}</div>
            <div className="mt-1 text-xs">{t('admin.group.state.staleDataDescription')}</div>
          </div>
        ) : null}
        viewportProps={{ 'data-admin-group-table-viewport': true }}
      >
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">{t("admin.group.index.text.hzx914", "Group name")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.ah7xpy", "Provider")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.azlr3p", "Price reference mode")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.3aby9g", "Rate multiplier")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.anh4cj", "Group type")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.qxduge", "Accounts")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.svba5d", "Capacity")}</th>
              <th className="px-6 py-4">{t("admin.group.index.text.yetrt4", "Usage")}</th>
              <th className="px-6 py-4">{t("admin.finance.index.text.1ccx4t4", "Status")}<ChevronDown className="inline w-3 h-3 ml-1" /></th>
              <th className="px-6 py-4">{t("admin.group.index.text.501w24", "Actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {loading ? (
              <BusinessStateTableRow colSpan={10} kind="loading" title={t('admin.group.state.loading')} />
            ) : loadError && groups.length === 0 ? (
              <BusinessStateTableRow
                colSpan={10}
                kind="error"
                title={t('admin.group.state.loadErrorTitle')}
                description={t('admin.group.state.loadErrorDescription')}
                onRetry={() => { void loadGroups(); }}
                retryLabel={t('common.actions.retry')}
              />
            ) : filteredGroups.length === 0 ? (
              <BusinessStateTableRow
                colSpan={10}
                kind="empty"
                title={t('admin.group.state.emptyTitle')}
                description={t('admin.group.state.emptyDescription')}
              />
            ) : filteredGroups.map(group => (
              <tr key={group.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <div className="flex flex-col gap-1">
                    <span>{group.groupName}</span>
                    <span className="text-xs font-mono text-slate-500">{group.groupCode}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full text-xs font-medium border border-amber-500/20">
                    <Settings className="w-3.5 h-3.5" /> {group.providerCode}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs">
                    {group.priceReferenceMode}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {formatGroupMultiplier(group)}x
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs">
                    {displayGroupType(group.groupType, t)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <div>{t("admin.group.index.text.ds8wtk", "Available:")}<span className="font-mono text-emerald-600 dark:text-emerald-400">{group.accountCount.available}</span></div>
                    <div>{t("admin.group.index.text.n15nxr", "Total:")}<span className="font-mono">{group.accountCount.total}</span></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 text-xs font-mono">
                    <LayoutGrid className="w-3 h-3" /> {group.capacity.used} / {group.capacity.total}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <div>{t("admin.group.index.text.u2by7c", "Today")}<span className="font-mono text-slate-900 dark:text-white"> {group.usage.today}</span></div>
                    <div>{t("admin.group.index.text.1nuqk4t", "Total")}<span className="font-mono"> {group.usage.total}</span></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                    {displayGroupStatus(group.status, t)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <button onClick={() => openEditModal(group)} className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
                      <Edit className="w-4 h-4" /> <span>{t("admin.group.index.text.qreyeg", "Edit")}</span>
                    </button>
                    <button onClick={() => { void openChannelBindingModal(group); }} className="flex flex-col items-center gap-1 hover:text-emerald-500 transition-colors">
                      <Link2 className="w-4 h-4" /> <span>{t('admin.group.channelBindings.action')}</span>
                    </button>
                    <button onClick={() => setDeleteTarget(group)} className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" /> <span>{t("admin.group.index.text.1t2vi4h", "Delete")}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-xl flex flex-col my-auto relative">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingGroup ? t("admin.group.index.text.1emzsyy", "Edit group") : t("admin.group.index.text.1fp7vgi", "Create group")}</h3>
              <button onClick={closeModal} disabled={saving} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGroup} className="flex flex-col">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.hzx914", "Group name")}</label>
                  <input required name="groupName" type="text" placeholder={t("admin.group.index.text.1ok1vf5", "Enter group name")} defaultValue={editingGroup?.groupName ?? ''} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.1t62v98", "Group code")}</label>
                  <input required name="groupCode" type="text" placeholder={t("admin.group.index.text.17o8xwu", "Example: enterprise-default")} defaultValue={editingGroup?.groupCode ?? ''} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.azlr3p", "Price reference mode")}</label>
                  <div className="relative">
                    <select name="priceReferenceMode" value={priceReferenceMode} className={groupSelectClassName} onChange={event => setPriceReferenceMode(event.target.value as GroupData['priceReferenceMode'])}>
                      <option className={groupOptionClassName} value="multiplier">multiplier</option>
                      <option className={groupOptionClassName} value="official_price">official_price</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {priceReferenceMode === 'multiplier' ? (
                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.3aby9g", "Rate multiplier")}</label>
                    <input name="rateMultiplier" type="number" min="0.01" step="0.01" defaultValue={editingGroup?.rateMultiplier ?? 1} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.1w4hctg", "Official price multiplier")}</label>
                    <input name="officialPriceMultiplier" type="number" min="0.01" step="0.01" defaultValue={editingGroup?.officialPriceMultiplier ?? editingGroup?.rateMultiplier ?? 1} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.lsl2ul", "Group type")}</label>
                  <div className="relative">
                    <select name="groupType" defaultValue={editingGroup?.groupType ?? 'public'} className={groupSelectClassName}>
                      <option className={groupOptionClassName} value="public">public</option>
                      <option className={groupOptionClassName} value="dedicated">dedicated</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.group.index.text.1yz6zgp", "Capacity total")}</label>
                  <input name="capacityTotal" type="number" min="1" step="1" defaultValue={editingGroup?.capacity.total ?? 100} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">{t("admin.finance.index.text.1ccx4t4", "Status")}</label>
                  <div className="relative">
                    <select name="status" defaultValue={editingGroup?.status ?? 'active'} className={groupSelectClassName}>
                      <option className={groupOptionClassName} value="active">active</option>
                      <option className={groupOptionClassName} value="disabled">disabled</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={closeModal} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent dark:border-white/10 rounded-xl transition-colors bg-slate-50 dark:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60">
                  {t("admin.group.index.text.1589w37", "Cancel")}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-xl shadow-sm transition-colors border border-transparent dark:border-[rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:opacity-70">
                  {editingGroup ? t("admin.group.index.text.1c3mapc", "Save") : t("admin.group.index.text.khvw5c", "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {channelBindingTarget && (
        <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/50 backdrop-blur-sm">
          <aside data-admin-group-channel-bindings-drawer className="flex h-full w-[90vw] max-w-[90vw] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                  {t('admin.group.channelBindings.title')}
                </h3>
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {channelBindingTarget.groupName} | {t('admin.group.channelBindings.selectedCount', { count: selectedBindingCount })} | {t('admin.group.channelBindings.persistedCount', { count: channelBindings.length })}
                </p>
              </div>
              <button onClick={closeChannelBindingModal} disabled={bindingSaving} className="text-slate-400 transition-colors hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {bindingError && (
              <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                {bindingError}
              </div>
            )}

            <div data-admin-group-channel-bindings-toolbar className="flex shrink-0 flex-col gap-3 border-b border-slate-200 p-5 dark:border-white/10 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  data-admin-group-channel-binding-search
                  type="text"
                  value={bindingSearchQuery}
                  onChange={event => setBindingSearchQuery(event.currentTarget.value)}
                  placeholder={t('admin.group.channelBindings.searchPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white"
                />
              </div>
              <button
                data-admin-group-channel-binding-add
                type="button"
                onClick={openChannelBindingPicker}
                disabled={bindingLoading || bindingSaving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                <Plus className="h-4 w-4" />
                {t('admin.group.channelBindings.add')}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {bindingLoading ? (
                <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  {t('admin.group.channelBindings.loading')}
                </div>
              ) : visibleBindingRows.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  <div className="font-medium text-slate-700 dark:text-slate-200">
                    {selectedBindingCount === 0 ? t('admin.group.channelBindings.emptyBound') : t('admin.group.channelBindings.emptySearch')}
                  </div>
                  <div className="max-w-md text-xs leading-5">
                    {selectedBindingCount === 0 ? t('admin.group.channelBindings.emptyBoundDescription') : t('admin.group.channelBindings.emptySearchDescription')}
                  </div>
                </div>
              ) : (
                <table className="w-full min-w-[1180px] text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.channel')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.provider')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.models')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.modelScope')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.priority')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.weight')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.status')}</th>
                      <th className="px-5 py-3">{t('admin.group.channelBindings.columns.health')}</th>
                      <th className="px-5 py-3 text-right">{t('admin.group.channelBindings.columns.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {visibleBindingRows.map(row => {
                      const draft = bindingDraft[row.channelId];
                      return (
                        <tr key={row.channelId} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="max-w-[240px] px-5 py-3 align-middle">
                            <div className="min-w-0 whitespace-nowrap">
                              <div className="truncate font-medium text-slate-900 dark:text-white">{row.channelName}</div>
                              <div className="truncate text-xs text-slate-500">{row.channelCode}</div>
                            </div>
                          </td>
                          <td className="max-w-[180px] px-5 py-3 align-middle">
                            <div className="min-w-0 whitespace-nowrap">
                              <div className="truncate text-slate-700 dark:text-slate-200">{row.providerName}</div>
                              <div className="truncate text-xs text-slate-500">{row.providerCode}</div>
                            </div>
                          </td>
                          <td className="max-w-[260px] px-5 py-3 align-middle">
                            <div className="truncate whitespace-nowrap text-xs text-slate-500" title={row.models.join(', ')}>
                              {row.models.length > 0 ? row.models.join(', ') : t('admin.group.channelBindings.noModels')}
                            </div>
                            <div className="mt-1 truncate whitespace-nowrap text-[11px] text-slate-400" title={row.capabilities.join(', ')}>
                              {row.capabilities.join(', ')}
                            </div>
                          </td>
                          <td className="px-5 py-3 align-middle">
                            <input
                              type="text"
                              value={draft?.modelScope?.join(', ') ?? ''}
                              onChange={event => updateChannelBindingDraft(row.channelId, { modelScope: stringListInputValue(event.currentTarget.value) })}
                              placeholder={t('admin.group.channelBindings.allModels')}
                              className="w-52 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white"
                            />
                          </td>
                          <td className="px-5 py-3 align-middle">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={draft?.priority ?? row.priority}
                              onChange={event => updateChannelBindingDraft(row.channelId, { priority: numericInputValue(event.currentTarget.value) })}
                              className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white"
                            />
                          </td>
                          <td className="px-5 py-3 align-middle">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={draft?.weight ?? row.weight}
                              onChange={event => updateChannelBindingDraft(row.channelId, { weight: numericInputValue(event.currentTarget.value) })}
                              className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white"
                            />
                          </td>
                          <td className="px-5 py-3 align-middle">
                            <select
                              value={draft?.status ?? row.status}
                              onChange={event => updateChannelBindingDraft(row.channelId, { status: event.currentTarget.value as GroupChannelBindingInput['status'] })}
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white"
                            >
                              <option value="active">{t('admin.group.channelBindings.status.active')}</option>
                              <option value="disabled">{t('admin.group.channelBindings.status.disabled')}</option>
                            </select>
                          </td>
                          <td className="px-5 py-3 align-middle">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${row.healthStatus === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'}`}>
                              {row.healthStatus === 'error' ? t('admin.group.channelBindings.health.error') : t('admin.group.channelBindings.health.active')}
                            </span>
                          </td>
                          <td className="px-5 py-3 align-middle text-right">
                            <button
                              data-admin-group-channel-binding-remove
                              type="button"
                              onClick={() => removeChannelBindingDraft(row.channelId)}
                              className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                              aria-label={t('admin.group.channelBindings.remove')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 p-5 dark:border-white/10">
              <button type="button" onClick={closeChannelBindingModal} disabled={bindingSaving} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300 dark:hover:bg-white/5">
                {t('admin.group.channelBindings.cancel')}
              </button>
              <button type="button" onClick={() => { void saveChannelBindings(); }} disabled={bindingSaving || bindingLoading} className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-400">
                <Save className="h-4 w-4" />
                {bindingSaving ? t('admin.group.channelBindings.saving') : t('admin.group.channelBindings.save')}
              </button>
            </div>
          </aside>
          <button
            type="button"
            aria-label={t('common.actions.closeDrawer')}
            className="flex-1 cursor-default"
            onClick={closeChannelBindingModal}
            disabled={bindingSaving}
          />
          {isChannelPickerOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
              <div data-admin-group-channel-picker-modal className="flex h-[86vh] max-h-[86vh] w-[92vw] max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
                <div data-admin-group-channel-picker-header className="flex shrink-0 flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 lg:max-w-[280px]">
                    <h3 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                      {t('admin.group.channelBindings.pickerTitle')}
                    </h3>
                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                      {t('admin.group.channelBindings.pickerSubtitle', { count: addableChannelCount, total: pickerChannelOptions.length })}
                    </p>
                  </div>
                  <div className="relative w-full min-w-0 lg:max-w-xl">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      data-admin-group-channel-picker-search
                      type="text"
                      value={pickerSearchQuery}
                      onChange={event => {
                        setPickerSearchQuery(event.currentTarget.value);
                        setPickerPage(1);
                      }}
                      placeholder={t('admin.group.channelBindings.pickerSearchPlaceholder')}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#202020] dark:text-white"
                    />
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 lg:justify-end">
                    <div data-admin-group-channel-picker-selected-count className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {t('admin.group.channelBindings.selectedInPicker', { count: selectedPickerCount })}
                    </div>
                    <button onClick={closeChannelBindingPicker} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto">
                  {pickerChannelOptions.length === 0 ? (
                    <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      <div className="font-medium text-slate-700 dark:text-slate-200">{t('admin.group.channelBindings.pickerEmpty')}</div>
                      <div className="max-w-md text-xs leading-5">{t('admin.group.channelBindings.pickerEmptyDescription')}</div>
                    </div>
                  ) : (
                    <table className="w-full min-w-[860px] text-left text-sm text-slate-600 dark:text-slate-400">
                      <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
                        <tr>
                          <th className="w-12 px-5 py-3"></th>
                          <th className="px-5 py-3">{t('admin.group.channelBindings.columns.channel')}</th>
                          <th className="px-5 py-3">{t('admin.group.channelBindings.columns.provider')}</th>
                          <th className="px-5 py-3">{t('admin.group.channelBindings.columns.models')}</th>
                          <th className="px-5 py-3">{t('admin.group.channelBindings.columns.status')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                        {paginatedPickerChannelOptions.map(channel => {
                          const isAlreadyBound = isChannelAlreadyBound(channel.id);
                          return (
                            <tr key={channel.id} className={`hover:bg-slate-50 dark:hover:bg-white/5 ${isAlreadyBound ? 'bg-slate-50/70 text-slate-400 dark:bg-white/[0.02] dark:text-slate-500' : ''}`}>
                              <td className="px-5 py-3 align-middle">
                                <input
                                  type="checkbox"
                                  checked={isAlreadyBound || Boolean(pickerSelection[channel.id])}
                                  disabled={isAlreadyBound}
                                  onChange={() => togglePickerSelection(channel.id)}
                                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                />
                              </td>
                              <td className="max-w-[260px] px-5 py-3 align-middle">
                                <div className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                                  <div className="min-w-0">
                                    <div className={`truncate font-medium ${isAlreadyBound ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{channel.name}</div>
                                    <div className="truncate text-xs text-slate-500">{channel.channelCode}</div>
                                  </div>
                                  {isAlreadyBound && (
                                    <span data-admin-group-channel-picker-bound className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                                      {t('admin.group.channelBindings.alreadyAdded')}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="max-w-[200px] px-5 py-3 align-middle">
                                <div className="min-w-0 whitespace-nowrap">
                                  <div className={`truncate ${isAlreadyBound ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{channel.providerName}</div>
                                  <div className="truncate text-xs text-slate-500">{channel.providerCode}</div>
                                </div>
                              </td>
                              <td className="max-w-[320px] px-5 py-3 align-middle">
                                <div className="truncate whitespace-nowrap text-xs text-slate-500" title={channel.models.join(', ')}>
                                  {channel.models.length > 0 ? channel.models.join(', ') : t('admin.group.channelBindings.noModels')}
                                </div>
                                <div className="mt-1 truncate whitespace-nowrap text-[11px] text-slate-400" title={channel.capabilities.join(', ')}>
                                  {channel.capabilities.join(', ')}
                                </div>
                              </td>
                              <td className="px-5 py-3 align-middle">
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${channel.status === 'active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
                                  {channel.status === 'active' ? t('admin.group.channelBindings.status.active') : t('admin.group.channelBindings.status.disabled')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 p-5 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
                  <div data-admin-group-channel-picker-pagination className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center">
                    <span>
                      {t('admin.group.channelBindings.pagination', {
                        end: pickerEndIndex,
                        page: pickerPage,
                        start: pickerStartIndex,
                        total: pickerChannelOptions.length,
                        totalPages: pickerTotalPages,
                      })}
                    </span>
                    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-[#202020]">
                      <button
                        type="button"
                        aria-label={t('common.actions.previousPage')}
                        title={t('common.actions.previousPage')}
                        onClick={() => setPickerPage(current => Math.max(1, current - 1))}
                        disabled={pickerPage <= 1}
                        className="inline-flex h-8 w-8 items-center justify-center text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="border-x border-slate-200 px-3 text-xs font-medium text-slate-700 dark:border-white/10 dark:text-slate-200">
                        {pickerPage} / {pickerTotalPages}
                      </span>
                      <button
                        type="button"
                        aria-label={t('common.actions.nextPage')}
                        title={t('common.actions.nextPage')}
                        onClick={() => setPickerPage(current => Math.min(pickerTotalPages, current + 1))}
                        disabled={pickerPage >= pickerTotalPages}
                        className="inline-flex h-8 w-8 items-center justify-center text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={closeChannelBindingPicker} className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-[#1a1a1a] dark:text-slate-300 dark:hover:bg-white/5">
                      {t('admin.group.channelBindings.cancel')}
                    </button>
                    <button type="button" onClick={addSelectedChannelBindings} disabled={selectedPickerCount === 0} className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-emerald-500 dark:hover:bg-emerald-400">
                      <Plus className="h-4 w-4" />
                      {t('admin.group.channelBindings.addSelected', { count: selectedPickerCount })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete AI channel group?"
          description={`This removes "${deleteTarget.groupName}" from AI channel group configuration. Verify related routing and billing policies before confirming.`}
          confirmLabel="Delete group"
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={deletingGroupId === deleteTarget.id}
          onConfirm={() => void executeDelete()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

function formatGroupMultiplier(group: GroupData): string {
  const value = group.priceReferenceMode === 'official_price'
    ? group.officialPriceMultiplier ?? group.rateMultiplier
    : group.rateMultiplier;
  return value.toFixed(2);
}

function displayGroupType(type: GroupData['groupType'], t: ReturnType<typeof useTranslation>['t']): string {
  return type === 'dedicated' ? t("admin.group.index.text.1wiizn8", "dedicated") : t("admin.group.index.text.q3pv0x", "public");
}

function bindingsToDraft(bindings: GroupChannelBindingData[]): Record<string, GroupChannelBindingInput> {
  return Object.fromEntries(
    bindings.map(binding => [
      binding.channelId,
      {
        channelId: binding.channelId,
        priority: binding.priority,
        weight: binding.weight,
        status: binding.status,
        modelScope: binding.modelScope,
        capabilities: binding.capabilities,
      },
    ]),
  );
}

function numericInputValue(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.trunc(parsed) : 0;
}

function stringListInputValue(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[,\n]/)
        .map(item => item.trim())
        .filter(Boolean),
    ),
  );
}

function matchesChannelSearch(query: string, values: string[]): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }
  return values.some(value => value.toLowerCase().includes(normalizedQuery));
}

function displayGroupStatus(status: GroupData['status'], t: ReturnType<typeof useTranslation>['t']): string {
  return status === 'disabled' ? t("admin.group.index.text.1uz4mvb", "disabled") : t("admin.group.index.text.tt5vxa", "active");
}
