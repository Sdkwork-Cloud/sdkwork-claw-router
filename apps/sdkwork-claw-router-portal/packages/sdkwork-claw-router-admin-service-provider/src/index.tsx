import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Handshake,
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import {
  AdminTableShell,
  BusinessStatePanel,
  BusinessStateTableRow,
  CopyButton,
} from 'sdkwork-claw-router-commons';
import {
  ServiceProviderAccountService,
  type ServiceProviderAccountCreateInput,
  type ServiceProviderAccountRow,
  type ServiceProviderAccountType,
} from './serviceProviderService';

const ACCOUNT_TYPES: ServiceProviderAccountType[] = [
  'official_account',
  'mini_app',
  'life_account',
  'bot',
];

type AccountDraft = ServiceProviderAccountCreateInput & {
  providerName: string;
};

export function ServiceProviderAdmin() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ServiceProviderAccountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<AccountDraft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadAccounts = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await ServiceProviderAccountService.fetchAccounts();
      if (isActive()) {
        setRows(data);
      }
    } catch (error) {
      if (isActive()) {
        setRows([]);
        setLoadError(error instanceof Error && error.message ? error.message : t('admin.serviceProvider.states.error', 'Service provider accounts could not be loaded'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadAccounts(() => active);
    return () => {
      active = false;
    };
  }, [loadAccounts]);

  const visibleRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return rows;
    }
    return rows.filter((row) => [
      row.providerCode,
      row.providerName,
      row.providerStatus,
      row.account?.key,
      row.account?.name,
      row.account?.type,
      row.account?.appId,
    ].some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [rows, search]);

  const configuredCount = rows.filter((row) => row.account).length;

  const openCreateDialog = (row: ServiceProviderAccountRow) => {
    setNotice(null);
    setFormError(null);
    setDraft({
      provider: row.providerCode,
      providerName: row.providerName,
      type: row.providerCode === 'feishu' ? 'bot' : 'official_account',
      key: `${row.providerCode}_service_account`,
      name: row.providerName,
      appId: '',
      tokenRef: '',
      secretRef: '',
      aesKeyRef: '',
    });
  };

  const updateDraft = (patch: Partial<AccountDraft>) => {
    setDraft((current) => current ? { ...current, ...patch } : current);
    setFormError(null);
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) {
      return;
    }
    const name = draft.name.trim();
    const key = draft.key.trim();
    if (!name) {
      setFormError(t('admin.serviceProvider.validation.nameRequired', 'Account name is required'));
      return;
    }
    if (!key) {
      setFormError(t('admin.serviceProvider.validation.keyRequired', 'Account key is required'));
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      await ServiceProviderAccountService.createAccount({
        provider: draft.provider,
        type: draft.type,
        name,
        key,
        appId: draft.appId,
        tokenRef: draft.tokenRef,
        secretRef: draft.secretRef,
        aesKeyRef: draft.aesKeyRef,
      });
      setDraft(null);
      setNotice(t('admin.serviceProvider.notifications.created', 'Service provider account created'));
      await loadAccounts();
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : t('admin.serviceProvider.notifications.createFailed', 'Service provider account could not be created'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]"
      data-admin-service-provider="provider.account"
    >
      <main className="flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1a1a1a]">
        <div className="flex shrink-0 flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-500">
              <Handshake className="h-4 w-4" />
              {t('admin.serviceProvider.title', '服务商中心')}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t('admin.serviceProvider.accountsTitle', 'Service Provider Accounts')}
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              {t('admin.serviceProvider.subtitle', 'Manage service providers and the single account bound to each provider.')}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-sm shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="border-r border-slate-200 px-4 py-2 dark:border-white/10">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('admin.serviceProvider.summary.providers', 'Providers')}</div>
                <div className="font-semibold text-slate-900 dark:text-white">{rows.length}</div>
              </div>
              <div className="px-4 py-2">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('admin.serviceProvider.summary.configured', 'Configured')}</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">{configuredCount}</div>
              </div>
            </div>
            <div className="relative min-w-0 flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('admin.serviceProvider.searchPlaceholder', 'Search provider or account')}
                type="text"
                value={search}
              />
            </div>
            <button
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              onClick={() => void loadAccounts()}
              type="button"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {t('admin.serviceProvider.actions.refresh', 'Refresh')}
            </button>
          </div>
        </div>

        {notice ? (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </div>
        ) : null}

        {loadError ? (
          <BusinessStatePanel
            className="min-h-[360px]"
            description={loadError}
            kind="error"
            onRetry={() => void loadAccounts()}
            retryLabel={t('admin.serviceProvider.actions.refresh', 'Refresh')}
            title={t('admin.serviceProvider.states.error', 'Service provider accounts could not be loaded')}
          />
        ) : (
          <AdminTableShell className="m-5 mt-4 rounded-xl" viewportProps={{ 'data-admin-service-provider-accounts-table': true }}>
            <table className="w-full min-w-[1020px] text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.provider', 'Provider')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.providerStatus', 'Provider Status')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.account', 'Service Provider Account')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.type', 'Type')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.appId', 'App ID')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.credentials', 'Credential Refs')}</th>
                  <th className="px-6 py-4 font-semibold">{t('admin.serviceProvider.columns.updated', 'Updated')}</th>
                  <th className="px-6 py-4 text-right font-semibold">{t('admin.serviceProvider.columns.actions', 'Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {loading ? (
                  <BusinessStateTableRow colSpan={8} kind="loading" title={t('admin.serviceProvider.states.loading', 'Loading service provider accounts...')} />
                ) : visibleRows.length === 0 ? (
                  <BusinessStateTableRow
                    colSpan={8}
                    description={t('admin.serviceProvider.states.emptyDesc', 'Service providers appear here after open platform providers are configured.')}
                    kind="empty"
                    title={t('admin.serviceProvider.states.empty', 'No service providers')}
                  />
                ) : visibleRows.map((row) => (
                  <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={row.providerId}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-200">{row.providerName}</div>
                      <div className="mt-1 font-mono text-xs text-slate-400">{row.providerCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={row.providerStatus} />
                    </td>
                    <td className="px-6 py-4">
                      {row.account ? (
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-200">{row.account.name}</div>
                          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-400">
                            <span>{row.account.key}</span>
                            <CopyButton text={row.account.key} iconClassName="h-3.5 w-3.5" title={t('admin.serviceProvider.actions.copyKey', 'Copy account key')} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">{t('admin.serviceProvider.states.noAccount', 'No account configured')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{row.account ? formatAccountType(row.account.type, t) : '-'}</td>
                    <td className="px-6 py-4 font-mono text-xs">{row.account?.appId || '-'}</td>
                    <td className="px-6 py-4">
                      {row.account ? (
                        <div className="space-y-1 font-mono text-xs">
                          <div>{row.account.tokenRef || '-'}</div>
                          <div>{row.account.secretRef || '-'}</div>
                          <div>{row.account.aesKeyRef || '-'}</div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{row.account?.updatedAt || row.account?.createdAt || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      {row.account ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t('admin.serviceProvider.states.configured', 'Configured')}
                        </span>
                      ) : (
                        <button
                          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={row.providerStatus !== 'active'}
                          onClick={() => openCreateDialog(row)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                          {t('admin.serviceProvider.actions.createAccount', 'Create Account')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AdminTableShell>
        )}
      </main>

      {draft ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
          <form
            className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]"
            onSubmit={(event) => void handleCreateAccount(event)}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-500">
                  <KeyRound className="h-4 w-4" />
                  {draft.providerName}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t('admin.serviceProvider.form.title', 'Create service provider account')}
                </h3>
              </div>
              <button
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                onClick={() => setDraft(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              {formError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {formError}
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.name', 'Account name')}
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ name: event.target.value })}
                    value={draft.name}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.key', 'Account key')}
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ key: event.target.value })}
                    value={draft.key}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.type', 'Account type')}
                  </span>
                  <select
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ type: event.target.value as ServiceProviderAccountType })}
                    value={draft.type}
                  >
                    {ACCOUNT_TYPES.map((type) => (
                      <option key={type} value={type}>{formatAccountType(type, t)}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.appId', 'App ID')}
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ appId: event.target.value })}
                    value={draft.appId ?? ''}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.tokenRef', 'Token ref')}
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ tokenRef: event.target.value })}
                    value={draft.tokenRef ?? ''}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.secretRef', 'Secret ref')}
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ secretRef: event.target.value })}
                    value={draft.secretRef ?? ''}
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {t('admin.serviceProvider.form.aesKeyRef', 'AES key ref')}
                  </span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
                    onChange={(event) => updateDraft({ aesKeyRef: event.target.value })}
                    value={draft.aesKeyRef ?? ''}
                  />
                </label>
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 p-5 dark:border-white/10">
              <button
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                onClick={() => setDraft(null)}
                type="button"
              >
                {t('admin.serviceProvider.actions.close', 'Close')}
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                <Plus className="h-4 w-4" />
                {saving ? t('admin.serviceProvider.actions.saving', 'Saving...') : t('admin.serviceProvider.actions.save', 'Save Account')}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = status === 'active'
    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
    : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {status}
    </span>
  );
}

function formatAccountType(type: ServiceProviderAccountType, t: (key: string, fallback: string) => string): string {
  const fallback: Record<ServiceProviderAccountType, string> = {
    official_account: 'Official Account',
    mini_app: 'Mini App',
    life_account: 'Life Account',
    bot: 'Bot',
  };
  return t(`admin.serviceProvider.accountType.${type}`, fallback[type]);
}
