import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle2,
  Edit2,
  Link2,
  Plus,
  RefreshCw,
  Search,
  Smartphone,
  Trash2,
  X,
} from 'lucide-react';
import {
  AdminTableShell,
  BusinessStatePanel,
  BusinessStateTableRow,
  ConfirmDialog,
  CopyButton,
} from 'sdkwork-clawrouter-pc-commons';
import {
  WechatMiniProgramService,
  type WechatMiniProgramEntryItem,
  type WechatMiniProgramEntryStatus,
  type WechatMiniProgramItem,
  type WechatMiniProgramStatus,
} from './openPlatformWechatMiniProgramService';

type AccountDraftMode = 'create' | 'edit';
type EntryDraftMode = 'create' | 'edit';
type MiniProgramSectionId = 'accounts' | 'urls';

interface WechatMiniProgramAdminProps {
  sectionId?: string;
}

interface AccountDraft {
  mode: AccountDraftMode;
  accountId?: string;
  name: string;
  appId: string;
  appSecret: string;
  token: string;
  encodingAesKey: string;
  hasAppSecret: boolean;
  hasToken: boolean;
  hasEncodingAesKey: boolean;
  status: WechatMiniProgramStatus;
  qrDefault: boolean;
}

interface EntryDraft {
  mode: EntryDraftMode;
  entryId?: string;
  key: string;
  url: string;
  status: WechatMiniProgramEntryStatus;
}

interface DeleteEntryTarget {
  id: string;
  key: string;
}

const DEFAULT_MINI_PROGRAM_SECTION_ID: MiniProgramSectionId = 'accounts';
const WECHAT_MINI_PROGRAM_PRODUCT_SIGNAL = '小程序';
const OPEN_PLATFORM_KEY_MAX_LENGTH = 128;
const OPEN_PLATFORM_KEY_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;

export function resolveMiniProgramSectionId(sectionId?: string): MiniProgramSectionId {
  if (sectionId === 'accounts' || sectionId === 'urls') {
    return sectionId;
  }
  return DEFAULT_MINI_PROGRAM_SECTION_ID;
}

export function WechatMiniProgramAdmin({ sectionId }: WechatMiniProgramAdminProps = {}) {
  const { t } = useTranslation();
  const activeSection = resolveMiniProgramSectionId(sectionId);
  const [accounts, setAccounts] = useState<WechatMiniProgramItem[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [entries, setEntries] = useState<WechatMiniProgramEntryItem[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const [accountDraft, setAccountDraft] = useState<AccountDraft | null>(null);
  const [entryDraft, setEntryDraft] = useState<EntryDraft | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteEntryTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadAccounts = useCallback(async (isActive: () => boolean = () => true) => {
    setAccountsLoading(true);
    setAccountsError(null);
    try {
      const data = await WechatMiniProgramService.fetchAccounts();
      if (isActive()) {
        setAccounts(data);
        setSelectedAccountId((current) => {
          if (current && data.some((account) => account.id === current)) {
            return current;
          }
          return data[0]?.id ?? '';
        });
      }
    } catch (error) {
      if (isActive()) {
        setAccounts([]);
        setAccountsError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatMini.states.accountsError', 'WeChat mini programs could not be loaded'));
      }
    } finally {
      if (isActive()) {
        setAccountsLoading(false);
      }
    }
  }, [t]);

  const loadEntries = useCallback(async (accountId: string, isActive: () => boolean = () => true) => {
    if (!accountId) {
      setEntries([]);
      setEntriesError(null);
      setEntriesLoading(false);
      return;
    }
    setEntriesLoading(true);
    setEntriesError(null);
    try {
      const data = await WechatMiniProgramService.fetchEntries(accountId);
      if (isActive()) {
        setEntries(data);
      }
    } catch (error) {
      if (isActive()) {
        setEntries([]);
        setEntriesError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatMini.states.entriesError', 'WeChat mini program URL entries could not be loaded'));
      }
    } finally {
      if (isActive()) {
        setEntriesLoading(false);
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

  useEffect(() => {
    if (activeSection !== 'urls') {
      return;
    }
    let active = true;
    void loadEntries(selectedAccountId, () => active);
    return () => {
      active = false;
    };
  }, [activeSection, loadEntries, selectedAccountId]);

  const visibleAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return accounts;
    }
    return accounts.filter((account) => [
      account.name,
      account.appId,
      account.status,
      account.hasAppSecret ? 'AppSecret' : '',
      account.hasToken ? 'Token' : '',
      account.hasEncodingAesKey ? 'EncodingAESKey' : '',
    ].some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [accounts, search]);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const activeCount = accounts.filter((account) => account.status === 'active').length;
  const credentialCompleteCount = accounts.filter((account) => account.appId && account.hasAppSecret && account.hasToken).length;

  const openCreateAccount = () => {
    setNotice(null);
    setFormError(null);
    setAccountDraft({
      mode: 'create',
      name: t('admin.openPlatform.wechatMini.form.defaultAccountName', 'Mini Program'),
      appId: '',
      appSecret: '',
      token: '',
      encodingAesKey: '',
      hasAppSecret: false,
      hasToken: false,
      hasEncodingAesKey: false,
      status: 'active',
      qrDefault: false,
    });
  };

  const openEditAccount = (account: WechatMiniProgramItem) => {
    setNotice(null);
    setFormError(null);
    setAccountDraft({
      mode: 'edit',
      accountId: account.id,
      name: account.name,
      appId: account.appId,
      appSecret: '',
      token: '',
      encodingAesKey: '',
      hasAppSecret: account.hasAppSecret,
      hasToken: account.hasToken,
      hasEncodingAesKey: account.hasEncodingAesKey,
      status: account.status,
      qrDefault: account.qrDefault,
    });
  };

  const updateAccountDraft = (patch: Partial<AccountDraft>) => {
    setAccountDraft((current) => current ? { ...current, ...patch } : current);
    setFormError(null);
  };

  const handleAccountSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accountDraft) {
      return;
    }
    const name = accountDraft.name.trim();
    const appId = accountDraft.appId.trim();
    const appSecret = accountDraft.appSecret.trim();
    const token = accountDraft.token.trim();
    const encodingAesKey = accountDraft.encodingAesKey.trim();
    if (!name) {
      setFormError(t('admin.openPlatform.wechatMini.validation.nameRequired', 'Account name is required'));
      return;
    }
    if (!appId) {
      setFormError(t('admin.openPlatform.wechatMini.validation.appIdRequired', 'AppID is required'));
      return;
    }
    if (accountDraft.mode === 'create' && !appSecret) {
      setFormError(t('admin.openPlatform.wechatMini.validation.appSecretRequired', 'AppSecret is required'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (accountDraft.mode === 'create') {
        await WechatMiniProgramService.createAccount({
          name,
          appId,
          appSecret,
          token,
          encodingAesKey,
        });
        setNotice(t('admin.openPlatform.wechatMini.notifications.accountCreated', 'WeChat mini program created'));
      } else if (accountDraft.accountId) {
        await WechatMiniProgramService.updateAccount(accountDraft.accountId, {
          name,
          status: accountDraft.status,
          qrDefault: accountDraft.qrDefault,
          appId,
          appSecret: optionalSecretPatch(appSecret),
          token: optionalSecretPatch(token),
          encodingAesKey: optionalSecretPatch(encodingAesKey),
        });
        setNotice(t('admin.openPlatform.wechatMini.notifications.accountUpdated', 'WeChat mini program updated'));
      }
      setAccountDraft(null);
      await loadAccounts();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setFormError(message || t('admin.openPlatform.wechatMini.notifications.accountSaveFailed', 'WeChat mini program could not be saved'));
    } finally {
      setSaving(false);
    }
  };

  const openCreateEntry = () => {
    setNotice(null);
    setFormError(null);
    setEntryDraft({
      mode: 'create',
      key: 'mini_app_url',
      url: '',
      status: 'active',
    });
  };

  const openEditEntry = (entry: WechatMiniProgramEntryItem) => {
    setNotice(null);
    setFormError(null);
    setEntryDraft({
      mode: 'edit',
      entryId: entry.id,
      key: entry.key,
      url: entry.url,
      status: entry.status,
    });
  };

  const updateEntryDraft = (patch: Partial<EntryDraft>) => {
    setEntryDraft((current) => current ? { ...current, ...patch } : current);
    setFormError(null);
  };

  const handleEntrySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entryDraft || !selectedAccountId) {
      return;
    }
    const key = entryDraft.key.trim();
    const url = entryDraft.url.trim();
    if (!key) {
      setFormError(t('admin.openPlatform.wechatMini.validation.entryKeyRequired', 'Mini program URL key is required'));
      return;
    }
    if (!isValidOpenPlatformKey(key)) {
      setFormError(t('admin.openPlatform.wechatMini.validation.entryKeyInvalid', 'Use lowercase letters, numbers, dots, underscores, colons, or hyphens; start with a lowercase letter or number and keep within 128 characters.'));
      return;
    }
    if (!url) {
      setFormError(t('admin.openPlatform.wechatMini.validation.entryUrlRequired', 'Mini program URL is required'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (entryDraft.mode === 'create') {
        await WechatMiniProgramService.createEntry(selectedAccountId, { key, url });
        setNotice(t('admin.openPlatform.wechatMini.notifications.entryCreated', 'WeChat mini program URL entry created'));
      } else if (entryDraft.entryId) {
        await WechatMiniProgramService.updateEntry(selectedAccountId, entryDraft.entryId, {
          key,
          url,
          status: entryDraft.status,
        });
        setNotice(t('admin.openPlatform.wechatMini.notifications.entryUpdated', 'WeChat mini program URL entry updated'));
      }
      setEntryDraft(null);
      await loadEntries(selectedAccountId);
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatMini.notifications.entrySaveFailed', 'WeChat mini program URL entry could not be saved'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (!deleteTarget || !selectedAccountId) {
      return;
    }
    setDeleting(true);
    try {
      await WechatMiniProgramService.deleteEntry(selectedAccountId, deleteTarget.id);
      setDeleteTarget(null);
      setNotice(t('admin.openPlatform.wechatMini.notifications.entryDeleted', 'WeChat mini program URL entry deleted'));
      await loadEntries(selectedAccountId);
    } catch (error) {
      setEntriesError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatMini.notifications.entryDeleteFailed', 'WeChat mini program URL entry could not be deleted'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]"
      data-admin-open-platform-wechat-mini="true"
      data-admin-open-platform-wechat-mini-product={WECHAT_MINI_PROGRAM_PRODUCT_SIGNAL}
    >
      <main className="flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1a1a1a]">
        <div className="flex shrink-0 justify-end border-b border-slate-200 p-3 dark:border-white/10">
          <div className="grid w-full grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-sm shadow-sm dark:border-white/10 dark:bg-white/5 lg:w-auto">
            <SummaryCell label={t('admin.openPlatform.wechatMini.summary.accounts', 'Mini Programs')} value={accounts.length} />
            <SummaryCell label={t('admin.openPlatform.wechatMini.summary.active', 'Active')} value={activeCount} tone="cyan" />
            <SummaryCell label={t('admin.openPlatform.wechatMini.summary.credentials', 'Credentials')} value={credentialCompleteCount} />
          </div>
        </div>

        {notice ? (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </div>
        ) : null}

        {activeSection === 'accounts' ? (
          <MiniProgramAccountsSection
            accountsError={accountsError}
            loading={accountsLoading}
            onCreateAccount={openCreateAccount}
            onEditAccount={openEditAccount}
            onRefresh={() => void loadAccounts()}
            search={search}
            setSearch={setSearch}
            visibleAccounts={visibleAccounts}
          />
        ) : null}

        {activeSection === 'urls' ? (
          <MiniProgramUrlsSection
            accounts={accounts}
            accountsLoading={accountsLoading}
            entries={entries}
            entriesError={entriesError}
            entriesLoading={entriesLoading}
            onCreateEntry={openCreateEntry}
            onDeleteEntry={setDeleteTarget}
            onEditEntry={openEditEntry}
            onRefresh={() => void loadEntries(selectedAccountId)}
            selectedAccount={selectedAccount}
            selectedAccountId={selectedAccountId}
            setSelectedAccountId={setSelectedAccountId}
          />
        ) : null}
      </main>

      {accountDraft ? (
        <AccountDialog
          draft={accountDraft}
          formError={formError}
          onClose={() => setAccountDraft(null)}
          onSubmit={handleAccountSubmit}
          saving={saving}
          updateDraft={updateAccountDraft}
        />
      ) : null}

      {entryDraft ? (
        <EntryDialog
          draft={entryDraft}
          formError={formError}
          onClose={() => setEntryDraft(null)}
          onSubmit={handleEntrySubmit}
          saving={saving}
          updateDraft={updateEntryDraft}
        />
      ) : null}

      {deleteTarget ? (
        <ConfirmDialog
          cancelLabel={t('common.actions.cancel', 'Cancel')}
          confirmLabel={t('common.actions.delete', 'Delete')}
          description={t('admin.openPlatform.wechatMini.dialog.deleteEntryDesc', 'This removes the selected mini program URL entry from the current account.')}
          icon={<Trash2 className="h-5 w-5" />}
          isBusy={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void handleDeleteEntry()}
          title={t('admin.openPlatform.wechatMini.dialog.deleteEntryTitle', 'Delete mini program URL')}
          tone="danger"
        />
      ) : null}
    </div>
  );
}

function MiniProgramAccountsSection({
  accountsError,
  loading,
  onCreateAccount,
  onEditAccount,
  onRefresh,
  search,
  setSearch,
  visibleAccounts,
}: {
  accountsError: string | null;
  loading: boolean;
  onCreateAccount: () => void;
  onEditAccount: (account: WechatMiniProgramItem) => void;
  onRefresh: () => void;
  search: string;
  setSearch: (value: string) => void;
  visibleAccounts: WechatMiniProgramItem[];
}) {
  const { t } = useTranslation();

  if (accountsError) {
    return (
      <BusinessStatePanel
        className="min-h-[360px]"
        description={accountsError}
        kind="error"
        onRetry={onRefresh}
        retryLabel={t('admin.openPlatform.wechatMini.actions.refresh', 'Refresh')}
        title={t('admin.openPlatform.wechatMini.states.accountsError', 'WeChat mini programs could not be loaded')}
      />
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col" data-admin-open-platform-wechat-mini-accounts="true">
      <div className="flex shrink-0 flex-col gap-3 px-5 pt-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative min-w-0 flex-1 xl:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('admin.openPlatform.wechatMini.searchPlaceholder', 'Search mini program')}
            type="text"
            value={search}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('admin.openPlatform.wechatMini.actions.refresh', 'Refresh')}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700"
            onClick={onCreateAccount}
            type="button"
          >
            <Plus className="h-4 w-4" />
            {t('admin.openPlatform.wechatMini.actions.createAccount', 'Create Mini Program')}
          </button>
        </div>
      </div>

      <AdminTableShell className="m-5 mt-4 min-h-0 flex-1 rounded-xl" viewportClassName="min-h-0 flex-1" viewportProps={{ 'data-admin-open-platform-wechat-mini-accounts-table': true }}>
        <table className="w-full min-w-[980px] text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.account', 'Mini Program')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.appId', 'App ID')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.configuration', 'Configuration')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.status', 'Status')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.updated', 'Updated')}</th>
              <th className="px-6 py-4 text-right font-semibold">{t('admin.openPlatform.wechatMini.columns.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {loading ? (
              <BusinessStateTableRow colSpan={6} kind="loading" title={t('admin.openPlatform.wechatMini.states.accountsLoading', 'Loading WeChat mini programs...')} />
            ) : visibleAccounts.length === 0 ? (
              <BusinessStateTableRow
                colSpan={6}
                description={t('admin.openPlatform.wechatMini.states.accountsEmptyDesc', 'Create a WeChat mini program before configuring mini_app_url entries.')}
                kind="empty"
                title={t('admin.openPlatform.wechatMini.states.accountsEmpty', 'No WeChat mini programs')}
              />
            ) : visibleAccounts.map((account) => (
              <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={account.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-slate-200">{account.name}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{account.appId || '-'}</td>
                <td className="px-6 py-4">
                  <CredentialStatusPills
                    hasAppSecret={account.hasAppSecret}
                    hasEncodingAesKey={account.hasEncodingAesKey}
                    hasToken={account.hasToken}
                  />
                </td>
                <td className="px-6 py-4"><StatusBadge status={account.status} /></td>
                <td className="px-6 py-4 font-mono text-xs">{account.updatedAt || account.createdAt || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                    onClick={() => onEditAccount(account)}
                    type="button"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    {t('common.actions.edit', 'Edit')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>
    </section>
  );
}

function MiniProgramUrlsSection({
  accounts,
  accountsLoading,
  entries,
  entriesError,
  entriesLoading,
  onCreateEntry,
  onDeleteEntry,
  onEditEntry,
  onRefresh,
  selectedAccount,
  selectedAccountId,
  setSelectedAccountId,
}: {
  accounts: WechatMiniProgramItem[];
  accountsLoading: boolean;
  entries: WechatMiniProgramEntryItem[];
  entriesError: string | null;
  entriesLoading: boolean;
  onCreateEntry: () => void;
  onDeleteEntry: (target: DeleteEntryTarget) => void;
  onEditEntry: (entry: WechatMiniProgramEntryItem) => void;
  onRefresh: () => void;
  selectedAccount: WechatMiniProgramItem | null;
  selectedAccountId: string;
  setSelectedAccountId: (accountId: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-0 flex-1 flex-col" data-admin-open-platform-wechat-mini-urls="true">
      <div className="flex shrink-0 flex-col gap-3 px-5 pt-4 xl:flex-row xl:items-center xl:justify-between">
        <select
          className="min-w-72 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500 disabled:opacity-60 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
          disabled={accountsLoading || accounts.length === 0}
          onChange={(event) => setSelectedAccountId(event.target.value)}
          value={selectedAccountId}
        >
          {accounts.length === 0 ? (
            <option value="">{t('admin.openPlatform.wechatMini.states.noAccountOption', 'No mini program')}</option>
          ) : accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${entriesLoading ? 'animate-spin' : ''}`} />
            {t('admin.openPlatform.wechatMini.actions.refresh', 'Refresh')}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedAccountId}
            onClick={onCreateEntry}
            type="button"
          >
            <Link2 className="h-4 w-4" />
            {t('admin.openPlatform.wechatMini.actions.createEntry', 'Create URL')}
          </button>
        </div>
      </div>

      {entriesError ? (
        <BusinessStatePanel
          className="min-h-[360px]"
          description={entriesError}
          kind="error"
          onRetry={onRefresh}
          retryLabel={t('admin.openPlatform.wechatMini.actions.refresh', 'Refresh')}
          title={t('admin.openPlatform.wechatMini.states.entriesError', 'WeChat mini program URL entries could not be loaded')}
        />
      ) : (
        <AdminTableShell className="m-5 mt-4 min-h-0 flex-1 rounded-xl" viewportClassName="min-h-0 flex-1" viewportProps={{ 'data-admin-open-platform-wechat-mini-urls-table': true }}>
          <table className="w-full min-w-[980px] text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.account', 'Mini Program')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.form.entryKey', 'URL key')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.form.entryUrl', 'Mini program URL')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.status', 'Status')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatMini.columns.updated', 'Updated')}</th>
                <th className="px-6 py-4 text-right font-semibold">{t('admin.openPlatform.wechatMini.columns.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {entriesLoading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title={t('admin.openPlatform.wechatMini.states.entriesLoading', 'Loading URLs...')} />
              ) : !selectedAccount ? (
                <BusinessStateTableRow
                  colSpan={6}
                  description={t('admin.openPlatform.wechatMini.states.accountsEmptyDesc', 'Create a WeChat mini program before configuring mini_app_url entries.')}
                  kind="empty"
                  title={t('admin.openPlatform.wechatMini.states.noAccountOption', 'No mini program')}
                />
              ) : entries.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={6}
                  description={t('admin.openPlatform.wechatMini.states.entriesEmptyDesc', 'Add mini_app_url entries for this mini program.')}
                  kind="empty"
                  title={t('admin.openPlatform.wechatMini.states.entriesEmpty', 'No URLs')}
                />
              ) : entries.map((entry) => (
                <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={entry.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-slate-200">{selectedAccount.name}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{entry.key}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="max-w-[420px] truncate">{entry.url}</span>
                      <CopyButton text={entry.url} iconClassName="h-3.5 w-3.5" title={t('admin.openPlatform.wechatMini.actions.copyUrl', 'Copy URL')} />
                    </div>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={entry.status} /></td>
                  <td className="px-6 py-4 font-mono text-xs">{entry.updatedAt || entry.createdAt || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                        onClick={() => onEditEntry(entry)}
                        type="button"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        {t('common.actions.edit', 'Edit')}
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 dark:border-red-500/30 dark:bg-white/5 dark:text-red-300 dark:hover:bg-red-500/10"
                        onClick={() => onDeleteEntry({ id: entry.id, key: entry.key })}
                        type="button"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('common.actions.delete', 'Delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminTableShell>
      )}
    </section>
  );
}

function AccountDialog({
  draft,
  formError,
  onClose,
  onSubmit,
  saving,
  updateDraft,
}: {
  draft: AccountDraft;
  formError: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  saving: boolean;
  updateDraft: (patch: Partial<AccountDraft>) => void;
}) {
  const { t } = useTranslation();
  const isEdit = draft.mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <form className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]" onSubmit={(event) => void onSubmit(event)}>
        <DialogHeader
          icon={<Smartphone className="h-4 w-4" />}
          kicker={t('admin.openPlatform.wechatMini.kicker', 'Mini Program')}
          onClose={onClose}
          title={isEdit ? t('admin.openPlatform.wechatMini.form.editAccountTitle', 'Edit mini program') : t('admin.openPlatform.wechatMini.form.createAccountTitle', 'Create mini program')}
        />
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {formError ? <FormError message={formError} /> : null}
          <div className="space-y-4">
            <TextInput label={t('admin.openPlatform.wechatMini.form.name', 'Mini Program Name')} onChange={(value) => updateDraft({ name: value })} value={draft.name} />
            <TextInput label={t('admin.openPlatform.wechatMini.form.appId', 'AppID')} mono onChange={(value) => updateDraft({ appId: value })} value={draft.appId} />
            <TextInput
              autoComplete="new-password"
              label={t('admin.openPlatform.wechatMini.form.appSecret', 'AppSecret')}
              onChange={(value) => updateDraft({ appSecret: value })}
              placeholder={isEdit && draft.hasAppSecret ? t('admin.openPlatform.wechatMini.form.configuredSecretPlaceholder', 'Configured; leave blank to keep unchanged') : undefined}
              type="password"
              value={draft.appSecret}
            />
            <TextInput
              autoComplete="new-password"
              label={t('admin.openPlatform.wechatMini.form.token', 'Token')}
              onChange={(value) => updateDraft({ token: value })}
              placeholder={isEdit && draft.hasToken ? t('admin.openPlatform.wechatMini.form.configuredSecretPlaceholder', 'Configured; leave blank to keep unchanged') : undefined}
              type="password"
              value={draft.token}
            />
            <TextInput
              autoComplete="new-password"
              label={t('admin.openPlatform.wechatMini.form.encodingAesKey', 'EncodingAESKey')}
              onChange={(value) => updateDraft({ encodingAesKey: value })}
              placeholder={isEdit && draft.hasEncodingAesKey ? t('admin.openPlatform.wechatMini.form.configuredSecretPlaceholder', 'Configured; leave blank to keep unchanged') : undefined}
              type="password"
              value={draft.encodingAesKey}
            />
            {isEdit ? (
              <SelectInput label={t('admin.openPlatform.wechatMini.form.status', 'Status')} onChange={(value) => updateDraft({ status: value as WechatMiniProgramStatus })} value={draft.status}>
                <option value="active">{t('admin.openPlatform.status.active', 'Active')}</option>
                <option value="inactive">{t('admin.openPlatform.status.inactive', 'Inactive')}</option>
              </SelectInput>
            ) : null}
            {isEdit ? (
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  checked={draft.qrDefault}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  onChange={(event) => updateDraft({ qrDefault: event.target.checked })}
                  type="checkbox"
                />
                {t('admin.openPlatform.wechatMini.form.qrDefault', 'Default QR account')}
              </label>
            ) : null}
          </div>
        </div>
        <DialogActions onClose={onClose} saving={saving} saveLabel={isEdit ? t('common.actions.save', 'Save') : t('admin.openPlatform.wechatMini.actions.createAccount', 'Create Mini Program')} />
      </form>
    </div>
  );
}

function EntryDialog({
  draft,
  formError,
  onClose,
  onSubmit,
  saving,
  updateDraft,
}: {
  draft: EntryDraft;
  formError: string | null;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  saving: boolean;
  updateDraft: (patch: Partial<EntryDraft>) => void;
}) {
  const { t } = useTranslation();
  const isEdit = draft.mode === 'edit';
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <form className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171717]" onSubmit={(event) => void onSubmit(event)}>
        <DialogHeader
          icon={<Link2 className="h-4 w-4" />}
          kicker={t('admin.openPlatform.entryType.mini_app_url', 'Mini Program URL')}
          onClose={onClose}
          title={isEdit ? t('admin.openPlatform.wechatMini.form.editEntryTitle', 'Edit mini program URL') : t('admin.openPlatform.wechatMini.form.createEntryTitle', 'Create mini program URL')}
        />
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {formError ? <FormError message={formError} /> : null}
          <div className="space-y-4">
            <TextInput label={t('admin.openPlatform.wechatMini.form.entryKey', 'URL key')} mono onChange={(value) => updateDraft({ key: value })} value={draft.key} />
            {isEdit ? (
              <SelectInput label={t('admin.openPlatform.wechatMini.form.status', 'Status')} onChange={(value) => updateDraft({ status: value as WechatMiniProgramEntryStatus })} value={draft.status}>
                <option value="active">{t('admin.openPlatform.status.active', 'Active')}</option>
                <option value="inactive">{t('admin.openPlatform.status.inactive', 'Inactive')}</option>
              </SelectInput>
            ) : null}
            <TextInput label={t('admin.openPlatform.wechatMini.form.entryUrl', 'Mini program URL')} mono onChange={(value) => updateDraft({ url: value })} value={draft.url} />
          </div>
        </div>
        <DialogActions onClose={onClose} saving={saving} saveLabel={isEdit ? t('common.actions.save', 'Save') : t('admin.openPlatform.wechatMini.actions.createEntry', 'Create URL')} />
      </form>
    </div>
  );
}

function DialogHeader({
  icon,
  kicker,
  onClose,
  title,
}: {
  icon: ReactNode;
  kicker: string;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10">
      <div>
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-500">
          {icon}
          {kicker}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <button
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
        onClick={onClose}
        type="button"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function DialogActions({
  onClose,
  saveLabel,
  saving,
}: {
  onClose: () => void;
  saveLabel: string;
  saving: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 p-5 dark:border-white/10">
      <button
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        onClick={onClose}
        type="button"
      >
        {t('common.actions.close', 'Close')}
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={saving}
        type="submit"
      >
        <Plus className="h-4 w-4" />
        {saving ? t('common.actions.saving', 'Saving...') : saveLabel}
      </button>
    </div>
  );
}

function TextInput({
  autoComplete,
  className = '',
  disabled = false,
  hint,
  label,
  mono = false,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  hint?: string;
  label: string;
  mono?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'password' | 'text';
  value: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <input
        autoComplete={autoComplete}
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 disabled:bg-slate-50 disabled:text-slate-400 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white dark:disabled:bg-white/5 ${mono ? 'font-mono' : ''}`}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {hint ? <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</span> : null}
    </label>
  );
}

function SelectInput({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      <select
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
      {message}
    </div>
  );
}

function CredentialStatusPills({
  hasAppSecret,
  hasEncodingAesKey,
  hasToken,
}: {
  hasAppSecret: boolean;
  hasEncodingAesKey: boolean;
  hasToken: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap gap-2">
      <CredentialStatusPill configured={hasAppSecret} label={t('admin.openPlatform.wechatMini.form.appSecret', 'AppSecret')} />
      <CredentialStatusPill configured={hasToken} label={t('admin.openPlatform.wechatMini.form.token', 'Token')} />
      <CredentialStatusPill configured={hasEncodingAesKey} label={t('admin.openPlatform.wechatMini.form.encodingAesKey', 'EncodingAESKey')} />
    </div>
  );
}

function CredentialStatusPill({ configured, label }: { configured: boolean; label: string }) {
  const { t } = useTranslation();
  const tone = configured
    ? 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300'
    : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone}`}>
      {configured ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
      {label}
      <span className="text-[11px] opacity-80">{configured ? t('admin.openPlatform.configuration.configured', 'Configured') : t('admin.openPlatform.configuration.notConfigured', 'Not configured')}</span>
    </span>
  );
}

function isValidOpenPlatformKey(value: string): boolean {
  return value.length <= OPEN_PLATFORM_KEY_MAX_LENGTH && OPEN_PLATFORM_KEY_PATTERN.test(value);
}

function optionalSecretPatch(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function SummaryCell({ label, tone = 'slate', value }: { label: string; tone?: 'cyan' | 'slate'; value: number }) {
  return (
    <div className="border-r border-slate-200 px-4 py-2 last:border-r-0 dark:border-white/10">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`font-semibold ${tone === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}>{value}</div>
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
