import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  CircleOff,
  Edit2,
  Loader2,
  Package,
  Plus,
  Search,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import {
  AdminAppService,
  createAdminAppInputFromForm,
  updateAdminAppInputFromForm,
  type AdminApp,
  type AdminAppMarketStatus,
  type AdminAppStatus,
} from '../services/adminAppService';

type AppModalMode = 'create' | 'edit';
type AppStatusFilter = '' | AdminAppStatus;
type AppMarketStatusFilter = '' | AdminAppMarketStatus;

const statusOptions = [
  { value: '', label: 'All runtime' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const marketStatusOptions = [
  { value: '', label: 'All marketplace' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'OFFLINE', label: 'Offline' },
];

export function AppAdmin() {
  const [apps, setApps] = useState<AdminApp[]>([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<AppStatusFilter>('');
  const [marketStatus, setMarketStatus] = useState<AppMarketStatusFilter>('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<AppModalMode>('create');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AdminApp | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminApp | null>(null);

  const adminAppQuery = useMemo(() => {
    const normalizedKeyword = keyword.trim();
    return {
      keyword: normalizedKeyword,
      status: status || undefined,
      marketStatus: marketStatus || undefined,
      pageNo: 1,
      pageSize: 100,
    };
  }, [keyword, marketStatus, status]);

  const loadApps = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      setApps(await AdminAppService.fetchApps(adminAppQuery));
    } catch (error) {
      setLoadError(errorMessage(error, 'Failed to load apps.'));
    } finally {
      setLoading(false);
    }
  }, [adminAppQuery]);

  useEffect(() => {
    void loadApps();
  }, [loadApps]);

  const summary = useMemo(() => ({
    total: apps.length,
    active: apps.filter((item) => item.status === 'ACTIVE').length,
    published: apps.filter((item) => item.marketStatus === 'PUBLISHED').length,
    draft: apps.filter((item) => item.marketStatus === 'DRAFT').length,
  }), [apps]);

  const openCreate = () => {
    setModalMode('create');
    setEditingApp(null);
    setActionError(null);
    setModalOpen(true);
  };

  const openEdit = (app: AdminApp) => {
    setModalMode('edit');
    setEditingApp(app);
    setActionError(null);
    setModalOpen(true);
  };

  const handleSaveApp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) {
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      const form = new FormData(event.currentTarget);
      if (modalMode === 'edit' && editingApp) {
        await AdminAppService.updateApp(editingApp.id, updateAdminAppInputFromForm(form));
      } else {
        await AdminAppService.createApp(createAdminAppInputFromForm(form));
      }
      await loadApps();
      setModalOpen(false);
      setEditingApp(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to save app.'));
    } finally {
      setSaving(false);
    }
  };

  const runAppAction = async (app: AdminApp, action: 'enable' | 'disable' | 'publish' | 'offline') => {
    setPendingActionId(app.id);
    setActionError(null);
    try {
      await {
        enable: () => AdminAppService.enableApp(app.id),
        disable: () => AdminAppService.disableApp(app.id),
        publish: () => AdminAppService.publishApp(app.id),
        offline: () => AdminAppService.offlineApp(app.id),
      }[action]();
      await loadApps();
    } catch (error) {
      setActionError(errorMessage(error, `Failed to ${action} app.`));
    } finally {
      setPendingActionId(null);
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setPendingActionId(id);
    setActionError(null);
    try {
      const deleted = await AdminAppService.deleteApp(id);
      if (deleted) {
        await loadApps();
      }
      setDeleteTarget(null);
    } catch (error) {
      setActionError(errorMessage(error, 'Failed to delete app.'));
    } finally {
      setPendingActionId(null);
    }
  };

  return (
    <div className="flex h-full w-full flex-col space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Package className="h-6 w-6 text-sky-500" />
            App Store
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage app marketplace publishing, runtime status, delivery metadata, and install endpoints.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
          App
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Total" value={summary.total} />
        <Metric label="Active" value={summary.active} />
        <Metric label="Published" value={summary.published} />
        <Metric label="Draft" value={summary.draft} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              placeholder="Search apps, keys, packages"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as AppStatusFilter)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
          >
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <select
            value={marketStatus}
            onChange={(event) => setMarketStatus(event.target.value as AppMarketStatusFilter)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-slate-200"
          >
            {marketStatusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
        {actionError ? (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {actionError}
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">App</th>
                <th className="px-4 py-3 font-semibold">Delivery</th>
                <th className="px-4 py-3 font-semibold">Lifecycle</th>
                <th className="px-4 py-3 font-semibold">Endpoints</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <BusinessStateTableRow colSpan={5} kind="loading" title="Loading apps" />
              ) : loadError ? (
                <BusinessStateTableRow colSpan={5} kind="error" title={loadError} onRetry={() => void loadApps()} />
              ) : apps.length === 0 ? (
                <BusinessStateTableRow colSpan={5} kind="empty" title="No apps found" />
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="align-top transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                          <Store className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{app.name}</span>
                            <Badge value={app.appType ?? 'app'} />
                          </div>
                          <div className="mt-1 font-mono text-xs text-slate-600 dark:text-slate-300">{app.appKey || '-'}</div>
                          <div className="mt-1 font-mono text-xs text-slate-500">{app.uuid}</div>
                          <div className="mt-2 max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">{app.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div>{app.packageName || '-'}</div>
                      <div className="mt-1 text-xs text-slate-500">{app.bundleId || app.version || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge value={app.status} />
                        <StatusBadge value={app.marketStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      <div className="max-w-xs truncate">{app.accessUrl || '-'}</div>
                      <div className="mt-1 max-w-xs truncate text-xs text-slate-500">{app.downloadUrl || app.storeUrl || '-'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <IconButton title="Edit" onClick={() => openEdit(app)} icon={<Edit2 className="h-4 w-4" />} />
                        <IconButton
                          title={app.marketStatus === 'PUBLISHED' ? 'Offline' : 'Publish'}
                          onClick={() => void runAppAction(app, app.marketStatus === 'PUBLISHED' ? 'offline' : 'publish')}
                          icon={app.marketStatus === 'PUBLISHED' ? <CircleOff className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === app.id}
                        />
                        <IconButton
                          title={app.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                          onClick={() => void runAppAction(app, app.status === 'ACTIVE' ? 'disable' : 'enable')}
                          icon={app.status === 'ACTIVE' ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                          disabled={pendingActionId === app.id}
                        />
                        <IconButton
                          title="Delete"
                          onClick={() => setDeleteTarget(app)}
                          icon={<Trash2 className="h-4 w-4" />}
                          disabled={pendingActionId === app.id}
                          danger
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen ? (
        <AppModal
          mode={modalMode}
          app={editingApp}
          isSaving={saving}
          error={actionError}
          onClose={() => {
            if (!saving) {
              setModalOpen(false);
              setEditingApp(null);
            }
          }}
          onSubmit={handleSaveApp}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          title="Delete app"
          description={`Delete ${deleteTarget.name}. Attached catalog assets and artifacts will be removed by the backend command.`}
          confirmLabel="Delete"
          tone="danger"
          isBusy={pendingActionId === deleteTarget.id}
          icon={<Trash2 className="h-4 w-4" />}
          onConfirm={() => void executeDelete()}
          onCancel={() => {
            if (!pendingActionId) {
              setDeleteTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function AppModal({
  mode,
  app,
  isSaving,
  error,
  onClose,
  onSubmit,
}: {
  mode: AppModalMode;
  app: AdminApp | null;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const isEdit = mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit App' : 'Create App'}</h3>
            <p className="mt-1 text-xs text-slate-500">Define store metadata, delivery endpoints, and install configuration.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="max-h-[calc(90vh-73px)] overflow-y-auto p-5">
          {error ? <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" name="name" defaultValue={app?.name} required />
            <Field label="App Key" name="appKey" defaultValue={standardAppKey(app)} required />
            <Field label="Version" name="version" defaultValue={isEdit ? app?.version ?? '' : app?.version ?? '1.0.0'} />
            <Field label="App Type" name="appType" defaultValue={isEdit ? app?.appType ?? '' : app?.appType ?? 'web'} />
            <Field label="Package Name" name="packageName" defaultValue={app?.packageName ?? ''} />
            <Field label="Bundle ID" name="bundleId" defaultValue={app?.bundleId ?? ''} />
            <Field label="Access URL" name="accessUrl" defaultValue={app?.accessUrl ?? ''} />
            <Field label="Store URL" name="storeUrl" defaultValue={app?.storeUrl ?? ''} />
            <Field label="Download URL" name="downloadUrl" defaultValue={app?.downloadUrl ?? ''} />
            <Field label="Icon URL" name="iconUrl" defaultValue={app?.iconUrl ?? ''} />
            <Field label="Project ID" name="projectId" defaultValue={app?.projectId ?? ''} />
            {!isEdit ? (
              <>
                <SelectField label="Runtime Status" name="status" defaultValue={app?.status ?? 'ACTIVE'}>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </SelectField>
                <SelectField label="Market Status" name="marketStatus" defaultValue={app?.marketStatus ?? 'DRAFT'}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="OFFLINE">Offline</option>
                </SelectField>
              </>
            ) : null}
          </div>
          <div className="mt-4">
            <TextArea label="Description" name="description" rows={4} defaultValue={app?.description ?? ''} plain />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextArea label="Icon" name="icon" defaultValue={formatJson(app?.icon ?? {})} />
            <TextArea label="Resource List" name="resourceList" defaultValue={formatJson(app?.resourceList ?? {})} />
            <TextArea label="Config" name="config" defaultValue={formatJson(app?.config ?? {})} />
            <TextArea label="Platforms" name="platforms" defaultValue={formatJson(app?.platforms ?? {})} />
            <TextArea label="Install Platforms" name="installPlatforms" defaultValue={formatJson(app?.installPlatforms ?? {})} />
            <TextArea label="Install Skill" name="installSkill" defaultValue={formatJson(app?.installSkill ?? {})} />
            <TextArea label="Install Config" name="installConfig" defaultValue={formatJson(app?.installConfig ?? {})} />
            <TextArea label="Release Notes" name="releaseNotes" defaultValue={formatJson(app?.releaseNotes ?? [])} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#171717]">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value.toLocaleString()}</div>
    </div>
  );
}

function Field({ label, name, defaultValue = '', type = 'text', required = false }: { label: string; name: string; defaultValue?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </label>
  );
}

function SelectField({ label, name, defaultValue, children }: { label: string; name: string; defaultValue: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-[#202020] dark:text-white"
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({ label, name, defaultValue, rows = 8, plain = false }: { label: string; name: string; defaultValue: string; rows?: number; plain?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className={`w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400 dark:border-white/10 dark:bg-white/5 dark:text-white ${plain ? '' : 'font-mono text-xs'}`}
      />
    </label>
  );
}

function IconButton({ title, icon, disabled, danger = false, onClick }: { title: string; icon: React.ReactNode; disabled?: boolean; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10'
          : 'border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:text-sky-300'
      }`}
    >
      {icon}
    </button>
  );
}

function Badge({ value }: { value: string }) {
  return <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">{value}</span>;
}

function StatusBadge({ value }: { value: string }) {
  const tone = value === 'PUBLISHED' || value === 'ACTIVE'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
    : value === 'OFFLINE' || value === 'INACTIVE'
      ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  return <span className={`inline-flex w-fit rounded-md px-2 py-0.5 text-xs font-semibold ${tone}`}>{value}</span>;
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function standardAppKey(app: AdminApp | null): string {
  if (!app) {
    return '';
  }
  if (app.appKey) {
    return app.appKey;
  }
  return app.config.standard.appKey;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
