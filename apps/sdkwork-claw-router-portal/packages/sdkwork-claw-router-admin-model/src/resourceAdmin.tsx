import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmDialog } from 'sdkwork-claw-router-commons';
import { Check, Database, Edit, Loader2, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  ResourceGroupService,
  type ResourceGroupCreateInput,
  type ResourceGroupItem,
  type ResourceGroupResourceItem,
  type ResourceGroupUpdateInput,
} from './modelService';

type ResourceGroupFormState = {
  id?: string;
  groupCode: string;
  groupName: string;
  description: string;
  sortOrder: string;
  status: ResourceGroupItem['status'];
  members: string;
};

const emptyGroupForm: ResourceGroupFormState = {
  groupCode: '',
  groupName: '',
  description: '',
  sortOrder: '',
  status: 'active',
  members: '',
};

export function ResourceAdmin() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<ResourceGroupItem[]>([]);
  const [resources, setResources] = useState<ResourceGroupResourceItem[]>([]);
  const [selectedGroupCode, setSelectedGroupCode] = useState('api.all');
  const [search, setSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingResources, setLoadingResources] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState<ResourceGroupFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResourceGroupItem | null>(null);

  const selectedGroup = groups.find(group => group.groupCode === selectedGroupCode) ?? groups[0] ?? null;

  const loadGroups = async () => {
    setLoadingGroups(true);
    setLoadError(null);
    try {
      const nextGroups = await ResourceGroupService.fetchGroups();
      setGroups(nextGroups);
      if (!nextGroups.some(group => group.groupCode === selectedGroupCode)) {
        setSelectedGroupCode(nextGroups.find(group => group.groupCode === 'api.all')?.groupCode ?? nextGroups[0]?.groupCode ?? '');
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.model.resources.errors.loadGroups'));
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    void loadGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup) {
      setResources([]);
      return;
    }
    let active = true;
    setLoadingResources(true);
    setLoadError(null);
    ResourceGroupService.fetchResources(selectedGroup.groupCode)
      .then(items => {
        if (active) {
          setResources(items);
        }
      })
      .catch(error => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : t('admin.model.resources.errors.loadResources'));
          setResources([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingResources(false);
        }
      });
    return () => {
      active = false;
    };
  }, [selectedGroup?.groupCode]);

  const filteredGroups = useMemo(() => {
    const normalized = groupSearch.trim().toLowerCase();
    if (!normalized) {
      return groups;
    }
    return groups.filter(group =>
      group.groupName.toLowerCase().includes(normalized)
      || group.groupCode.toLowerCase().includes(normalized),
    );
  }, [groups, groupSearch]);

  const filteredResources = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return resources;
    }
    return resources.filter(resource =>
      resource.displayName.toLowerCase().includes(normalized)
      || resource.resourceCode.toLowerCase().includes(normalized)
      || (resource.vendorCode ?? '').toLowerCase().includes(normalized)
      || (resource.modalityCode ?? '').toLowerCase().includes(normalized),
    );
  }, [resources, search]);

  const startCreate = () => {
    setForm(emptyGroupForm);
  };

  const startEdit = (group: ResourceGroupItem) => {
    setForm({
      id: group.id,
      groupCode: group.groupCode,
      groupName: group.groupName,
      description: group.description ?? '',
      sortOrder: group.sortOrder === null ? '' : String(group.sortOrder),
      status: group.status,
      members: resources
        .map(resource => resource.resourceCode)
        .join('\n'),
    });
  };

  const saveGroup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) {
      return;
    }
    setSaving(true);
    setLoadError(null);
    try {
      const input = formToInput(form);
      const saved = form.id
        ? await ResourceGroupService.updateGroup(form.id, input)
        : await ResourceGroupService.createGroup(input as ResourceGroupCreateInput);
      setGroups(current => {
        const exists = current.some(group => group.id === saved.id);
        const next = exists
          ? current.map(group => group.id === saved.id ? saved : group)
          : [...current, saved];
        return next.sort((left, right) => (left.sortOrder ?? 100000) - (right.sortOrder ?? 100000));
      });
      setSelectedGroupCode(saved.groupCode);
      setForm(null);
      setResources(await ResourceGroupService.fetchResources(saved.groupCode));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.model.resources.errors.saveGroup'));
    } finally {
      setSaving(false);
    }
  };

  const deleteGroup = async () => {
    if (!deleteTarget) {
      return;
    }
    setSaving(true);
    setLoadError(null);
    try {
      const deleted = await ResourceGroupService.deleteGroup(deleteTarget.id);
      if (deleted) {
        const nextGroups = groups.filter(group => group.id !== deleteTarget.id);
        setGroups(nextGroups);
        setSelectedGroupCode(nextGroups.find(group => group.groupCode === 'api.all')?.groupCode ?? nextGroups[0]?.groupCode ?? '');
      }
      setDeleteTarget(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : t('admin.model.resources.errors.deleteGroup'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-0 h-full w-full flex-col bg-slate-50 dark:bg-[#121212] rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-100" data-admin-model-resource-page>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {loadError && (
          <div className="absolute left-4 right-4 top-4 z-20 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {loadError}
          </div>
        )}

        <aside className="w-80 bg-white dark:bg-[#1a1a1a] border-r border-slate-200 dark:border-white/10 flex flex-col shrink-0" data-admin-model-resource-sidebar>
          <div className="border-b border-slate-200 bg-slate-50/50 p-4 dark:border-white/10 dark:bg-[#121212]/50" data-admin-model-resource-sidebar-header>
            <div className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">{t('admin.model.resources.sidebarTitle')}</span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => void loadGroups()}
                  disabled={loadingGroups}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  title={t('admin.model.resources.actions.refresh')}
                >
                  {loadingGroups ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={startCreate}
                  className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                  title={t('admin.model.resources.actions.newGroup')}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={groupSearch}
                  onChange={event => setGroupSearch(event.target.value)}
                  placeholder={t('admin.model.resources.groupSearch')}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loadingGroups ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('admin.model.resources.loading')}
              </div>
            ) : (
              filteredGroups.map(group => {
                const isActive = selectedGroup?.id === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroupCode(group.groupCode)}
                    className={[
                      'w-full rounded-lg p-2.5 text-left text-sm transition-all group',
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={[
                        'min-w-0 truncate font-medium',
                        isActive ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300',
                      ].join(' ')}>
                        {group.groupName}
                      </span>
                      <span className={[
                        'shrink-0 rounded-full px-2 py-0.5 text-xs',
                        isActive ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400',
                      ].join(' ')}>
                        {group.resourceCount}
                      </span>
                    </div>
                    <div className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-slate-500">{group.groupCode}</div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-50 p-4 dark:bg-[#121212]" data-admin-model-resource-main>
          <section className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] flex flex-col overflow-hidden">
            <div className="border-b border-slate-200 dark:border-white/10 p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-slate-500" />
                    <h2 className="truncate text-lg font-semibold tracking-normal">
                      {selectedGroup?.groupName ?? t('admin.model.resources.noGroup')}
                    </h2>
                    {selectedGroup?.dynamic && (
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        {t('admin.model.resources.dynamic')}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                    {selectedGroup?.groupCode ?? ''}
                  </p>
                </div>
                {selectedGroup && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(selectedGroup)}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200 dark:hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                      {t('admin.model.resources.actions.edit')}
                    </button>
                    <button
                      type="button"
                      disabled={selectedGroup.dynamic || selectedGroup.groupCode === 'api.all'}
                      onClick={() => setDeleteTarget(selectedGroup)}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 text-sm text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-500/30 dark:bg-[#202020] dark:text-rose-300 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('admin.model.resources.actions.delete')}
                    </button>
                  </div>
                )}
              </div>
              <div className="relative mt-4 max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder={t('admin.model.resources.resourceSearch')}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">{t('admin.model.resources.columns.resource')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.model.resources.columns.vendor')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.model.resources.columns.modality')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.model.resources.columns.role')}</th>
                    <th className="px-4 py-3 font-medium">{t('admin.model.resources.columns.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                  {loadingResources ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                        {t('admin.model.resources.loading')}
                      </td>
                    </tr>
                  ) : filteredResources.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                        {t('admin.model.resources.emptyResources')}
                      </td>
                    </tr>
                  ) : filteredResources.map(resource => (
                    <tr key={`${resource.id}-${resource.resourceCode}`} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{resource.displayName}</div>
                        <div className="mt-1 font-mono text-xs text-slate-500">{resource.resourceCode}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{resource.vendorCode ?? '-'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{resource.modalityCode ?? '-'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{resource.memberRole}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-200">
                          <Check className="h-3 w-3" />
                          {resource.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form onSubmit={saveGroup} className="w-full max-w-2xl rounded bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{form.id ? t('admin.model.resources.form.editTitle') : t('admin.model.resources.form.createTitle')}</h3>
              <button type="button" onClick={() => setForm(null)} className="rounded p-1 hover:bg-slate-100 dark:hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-300">{t('admin.model.resources.form.groupCode')}</span>
                <input value={form.groupCode} onChange={event => setForm({ ...form, groupCode: event.target.value })} disabled={form.groupCode === 'api.all'} className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-300">{t('admin.model.resources.form.groupName')}</span>
                <input value={form.groupName} onChange={event => setForm({ ...form, groupName: event.target.value })} className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-300">{t('admin.model.resources.form.sortOrder')}</span>
                <input value={form.sortOrder} onChange={event => setForm({ ...form, sortOrder: event.target.value })} className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" />
              </label>
              <label className="text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-300">{t('admin.model.resources.form.status')}</span>
                <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as ResourceGroupItem['status'] })} className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950">
                  <option value="active">active</option>
                  <option value="disabled">disabled</option>
                  <option value="inactive">inactive</option>
                </select>
              </label>
              <label className="sm:col-span-2 text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-300">{t('admin.model.resources.form.description')}</span>
                <textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows={2} className="w-full rounded border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950" />
              </label>
              <label className="sm:col-span-2 text-sm">
                <span className="mb-1 block text-slate-600 dark:text-slate-300">{t('admin.model.resources.form.members')}</span>
                <textarea
                  value={form.members}
                  disabled={form.groupCode === 'api.all'}
                  onChange={event => setForm({ ...form, members: event.target.value })}
                  rows={8}
                  className="w-full rounded border border-slate-200 bg-white px-3 py-2 font-mono text-xs dark:border-white/10 dark:bg-slate-950"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className="rounded border border-slate-200 px-4 py-2 text-sm dark:border-white/10">
                {t('admin.model.resources.actions.cancel')}
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-slate-900">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {t('admin.model.resources.actions.save')}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t('admin.model.resources.deleteDialog.title')}
          description={t('admin.model.resources.deleteDialog.description', { name: deleteTarget.groupName })}
          confirmLabel={t('admin.model.resources.actions.delete')}
          cancelLabel={t('admin.model.resources.actions.cancel')}
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={saving}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void deleteGroup()}
        />
      )}
    </div>
  );
}

function formToInput(form: ResourceGroupFormState): ResourceGroupCreateInput | ResourceGroupUpdateInput {
  const memberCodes = form.members
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean);
  return {
    groupCode: form.groupCode,
    groupName: form.groupName,
    groupType: 'api_group',
    selectionMode: form.groupCode === 'api.all' ? 'all' : 'manual',
    description: form.description.trim() || null,
    sortOrder: form.sortOrder.trim() ? Number(form.sortOrder.trim()) : null,
    status: form.status,
    members: memberCodes.map((resourceCode, index) => ({
      resourceCode,
      itemRole: 'included',
      sortOrder: index + 1,
    })),
  };
}
