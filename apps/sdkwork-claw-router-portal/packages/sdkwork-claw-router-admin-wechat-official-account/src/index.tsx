import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  CheckCircle2,
  Edit2,
  KeyRound,
  Link2,
  MenuSquare,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  AdminTableShell,
  BusinessStatePanel,
  BusinessStateTableRow,
  ConfirmDialog,
  CopyButton,
} from 'sdkwork-claw-router-commons';
import {
  WechatOfficialAccountService,
  type WechatOfficialAccountItem,
  type WechatOfficialAccountStatus,
  type WechatOfficialEntryItem,
  type WechatOfficialEntryStatus,
  type WechatOfficialEntryType,
} from './openPlatformWechatOfficialService';

type OfficialSectionId = 'accounts' | 'menus' | 'messages';
type AccountDraftMode = 'create' | 'edit';
type EntryDraftMode = 'create' | 'edit';

interface WechatOfficialAccountAdminProps {
  sectionId?: string;
}

interface AccountDraft {
  mode: AccountDraftMode;
  accountId?: string;
  key: string;
  name: string;
  appId: string;
  tokenRef: string;
  secretRef: string;
  aesKeyRef: string;
  status: WechatOfficialAccountStatus;
  qrDefault: boolean;
}

interface EntryDraft {
  mode: EntryDraftMode;
  entryId?: string;
  key: string;
  type: WechatOfficialEntryType;
  url: string;
  status: WechatOfficialEntryStatus;
}

interface DeleteEntryTarget {
  id: string;
  key: string;
}

const DEFAULT_OFFICIAL_SECTION_ID: OfficialSectionId = 'accounts';
const OPEN_PLATFORM_KEY_MAX_LENGTH = 128;
const OPEN_PLATFORM_KEY_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;
const CREDENTIAL_REF_MAX_LENGTH = 256;
const CREDENTIAL_REF_LOCATOR_PATTERN = /^[!-~]+$/;

interface AccountCredentialRefs {
  tokenRef: string;
  secretRef: string;
  aesKeyRef: string;
}

export function resolveOfficialSectionId(sectionId?: string): OfficialSectionId {
  if (sectionId === 'accounts' || sectionId === 'menus' || sectionId === 'messages') {
    return sectionId;
  }
  return DEFAULT_OFFICIAL_SECTION_ID;
}

export function WechatOfficialAccountAdmin({ sectionId }: WechatOfficialAccountAdminProps = {}) {
  const { t } = useTranslation();
  const activeSection = resolveOfficialSectionId(sectionId);
  const [accounts, setAccounts] = useState<WechatOfficialAccountItem[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [entries, setEntries] = useState<WechatOfficialEntryItem[]>([]);
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
      const data = await WechatOfficialAccountService.fetchAccounts();
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
        setAccountsError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatOfficial.states.accountsError', 'WeChat official accounts could not be loaded'));
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
      const data = await WechatOfficialAccountService.fetchEntries(accountId);
      if (isActive()) {
        setEntries(data);
      }
    } catch (error) {
      if (isActive()) {
        setEntries([]);
        setEntriesError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatOfficial.states.menusError', 'WeChat official account menu entries could not be loaded'));
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
    if (activeSection !== 'menus') {
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
      account.key,
      account.name,
      account.appId,
      account.status,
      account.tokenRef,
      account.secretRef,
      account.aesKeyRef,
    ].some((value) => String(value ?? '').toLowerCase().includes(query)));
  }, [accounts, search]);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? null;
  const activeCount = accounts.filter((account) => account.status === 'active').length;
  const credentialCompleteCount = accounts.filter((account) => account.appId && account.secretRef && account.tokenRef).length;

  const openCreateAccount = () => {
    setNotice(null);
    setFormError(null);
    setAccountDraft({
      mode: 'create',
      key: 'wechat_official_account',
      name: t('admin.openPlatform.wechatOfficial.form.defaultAccountName', '公众号'),
      appId: '',
      tokenRef: '',
      secretRef: '',
      aesKeyRef: '',
      status: 'active',
      qrDefault: false,
    });
  };

  const openEditAccount = (account: WechatOfficialAccountItem) => {
    setNotice(null);
    setFormError(null);
    setAccountDraft({
      mode: 'edit',
      accountId: account.id,
      key: account.key,
      name: account.name,
      appId: account.appId,
      tokenRef: account.tokenRef,
      secretRef: account.secretRef,
      aesKeyRef: account.aesKeyRef,
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
    const key = accountDraft.key.trim();
    const name = accountDraft.name.trim();
    if (!key) {
      setFormError(t('admin.openPlatform.wechatOfficial.validation.keyRequired', 'Account key is required'));
      return;
    }
    if (!isValidOpenPlatformKey(key)) {
      setFormError(t('admin.openPlatform.wechatOfficial.validation.keyInvalid', 'Use lowercase letters, numbers, dots, underscores, colons, or hyphens; start with a lowercase letter or number and keep within 128 characters.'));
      return;
    }
    if (!name) {
      setFormError(t('admin.openPlatform.wechatOfficial.validation.nameRequired', 'Account name is required'));
      return;
    }
    const credentialRefs = validateAccountCredentialRefs(accountDraft);
    if (!credentialRefs) {
      setFormError(t('admin.openPlatform.wechatOfficial.validation.credentialRefInvalid', 'Credential references must use vault:// or secret://, or a short ASCII path without spaces. Example: secret://wechat/official/default-secret'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (accountDraft.mode === 'create') {
        await WechatOfficialAccountService.createAccount({
          key,
          name,
          appId: accountDraft.appId.trim(),
          tokenRef: credentialRefs.tokenRef,
          secretRef: credentialRefs.secretRef,
          aesKeyRef: credentialRefs.aesKeyRef,
        });
        setNotice(t('admin.openPlatform.wechatOfficial.notifications.accountCreated', 'WeChat official account created'));
      } else if (accountDraft.accountId) {
        await WechatOfficialAccountService.updateAccount(accountDraft.accountId, {
          name,
          status: accountDraft.status,
          qrDefault: accountDraft.qrDefault,
          appId: accountDraft.appId.trim(),
          tokenRef: credentialRefs.tokenRef,
          secretRef: credentialRefs.secretRef,
          aesKeyRef: credentialRefs.aesKeyRef,
        });
        setNotice(t('admin.openPlatform.wechatOfficial.notifications.accountUpdated', 'WeChat official account updated'));
      }
      setAccountDraft(null);
      await loadAccounts();
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setFormError(
        isCredentialRefValidationErrorMessage(message)
          ? t('admin.openPlatform.wechatOfficial.validation.credentialRefInvalid', 'Credential references must use vault:// or secret://, or a short ASCII path without spaces. Example: secret://wechat/official/default-secret')
          : message || t('admin.openPlatform.wechatOfficial.notifications.accountSaveFailed', 'WeChat official account could not be saved'),
      );
    } finally {
      setSaving(false);
    }
  };

  const openCreateEntry = () => {
    setNotice(null);
    setFormError(null);
    setEntryDraft({
      mode: 'create',
      key: 'official_menu_entry',
      type: 'url',
      url: '',
      status: 'active',
    });
  };

  const openEditEntry = (entry: WechatOfficialEntryItem) => {
    setNotice(null);
    setFormError(null);
    setEntryDraft({
      mode: 'edit',
      entryId: entry.id,
      key: entry.key,
      type: entry.type,
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
      setFormError(t('admin.openPlatform.wechatOfficial.validation.menuKeyRequired', 'Menu key is required'));
      return;
    }
    if (!isValidOpenPlatformKey(key)) {
      setFormError(t('admin.openPlatform.wechatOfficial.validation.menuKeyInvalid', 'Use lowercase letters, numbers, dots, underscores, colons, or hyphens; start with a lowercase letter or number and keep within 128 characters.'));
      return;
    }
    if (!url) {
      setFormError(t('admin.openPlatform.wechatOfficial.validation.menuUrlRequired', 'Menu URL is required'));
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (entryDraft.mode === 'create') {
        await WechatOfficialAccountService.createEntry(selectedAccountId, {
          key,
          type: entryDraft.type,
          url,
        });
        setNotice(t('admin.openPlatform.wechatOfficial.notifications.menuCreated', 'WeChat official account menu entry created'));
      } else if (entryDraft.entryId) {
        await WechatOfficialAccountService.updateEntry(selectedAccountId, entryDraft.entryId, {
          key,
          type: entryDraft.type,
          url,
          status: entryDraft.status,
        });
        setNotice(t('admin.openPlatform.wechatOfficial.notifications.menuUpdated', 'WeChat official account menu entry updated'));
      }
      setEntryDraft(null);
      await loadEntries(selectedAccountId);
    } catch (error) {
      setFormError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatOfficial.notifications.menuSaveFailed', 'WeChat official account menu entry could not be saved'));
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
      await WechatOfficialAccountService.deleteEntry(selectedAccountId, deleteTarget.id);
      setDeleteTarget(null);
      setNotice(t('admin.openPlatform.wechatOfficial.notifications.menuDeleted', 'WeChat official account menu entry deleted'));
      await loadEntries(selectedAccountId);
    } catch (error) {
      setEntriesError(error instanceof Error && error.message ? error.message : t('admin.openPlatform.wechatOfficial.notifications.menuDeleteFailed', 'WeChat official account menu entry could not be deleted'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1a1a]">
      <main className="flex min-w-0 flex-1 flex-col bg-white dark:bg-[#1a1a1a]">
        <div className="flex shrink-0 flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
              <MessageCircle className="h-4 w-4" />
              {t('admin.openPlatform.wechatOfficial.kicker', '公众号')}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {t('admin.openPlatform.wechatOfficial.title', 'WeChat Official Accounts')}
            </h3>
            <p className="mt-1 max-w-3xl text-sm text-slate-500 dark:text-slate-400">
              {t('admin.openPlatform.wechatOfficial.subtitle', 'Manage official account credentials, menu entries, and message contract readiness from one independent admin module.')}
            </p>
          </div>
          <div className="grid w-full grid-cols-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-sm shadow-sm dark:border-white/10 dark:bg-white/5 lg:w-auto">
            <SummaryCell label={t('admin.openPlatform.wechatOfficial.summary.accounts', 'Accounts')} value={accounts.length} />
            <SummaryCell label={t('admin.openPlatform.wechatOfficial.summary.active', 'Active')} value={activeCount} tone="emerald" />
            <SummaryCell label={t('admin.openPlatform.wechatOfficial.summary.credentials', 'Credentials')} value={credentialCompleteCount} />
          </div>
        </div>

        {notice ? (
          <div className="mx-5 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {notice}
          </div>
        ) : null}

        {activeSection === 'accounts' ? (
          <AccountsSection
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

        {activeSection === 'menus' ? (
          <MenusSection
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

        {activeSection === 'messages' ? (
          <MessagesSection
            accounts={accounts}
            loading={accountsLoading}
            onRefresh={() => void loadAccounts()}
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
          description={t('admin.openPlatform.wechatOfficial.dialog.deleteMenuDesc', 'This removes the selected official account menu entry from the current account.')}
          icon={<Trash2 className="h-5 w-5" />}
          isBusy={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void handleDeleteEntry()}
          title={t('admin.openPlatform.wechatOfficial.dialog.deleteMenuTitle', 'Delete menu entry')}
          tone="danger"
        />
      ) : null}
    </div>
  );
}

function AccountsSection({
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
  onEditAccount: (account: WechatOfficialAccountItem) => void;
  onRefresh: () => void;
  search: string;
  setSearch: (value: string) => void;
  visibleAccounts: WechatOfficialAccountItem[];
}) {
  const { t } = useTranslation();

  if (accountsError) {
    return (
      <BusinessStatePanel
        className="min-h-[360px]"
        description={accountsError}
        kind="error"
        onRetry={onRefresh}
        retryLabel={t('admin.openPlatform.wechatOfficial.actions.refresh', 'Refresh')}
        title={t('admin.openPlatform.wechatOfficial.states.accountsError', 'WeChat official accounts could not be loaded')}
      />
    );
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col" data-admin-open-platform-wechat-official-accounts="true">
      <div className="flex shrink-0 flex-col gap-3 px-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('admin.openPlatform.wechatOfficial.searchPlaceholder', 'Search official account')}
            type="text"
            value={search}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('admin.openPlatform.wechatOfficial.actions.refresh', 'Refresh')}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            onClick={onCreateAccount}
            type="button"
          >
            <Plus className="h-4 w-4" />
            {t('admin.openPlatform.wechatOfficial.actions.createAccount', 'Create Account')}
          </button>
        </div>
      </div>
      <AdminTableShell className="m-5 mt-4 rounded-xl" viewportProps={{ 'data-admin-open-platform-wechat-official-accounts-table': true }}>
        <table className="w-full min-w-[1080px] text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.account', 'Official Account')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.appId', 'App ID')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.credentials', 'Credential Refs')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.qrDefault', 'QR Default')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.status', 'Status')}</th>
              <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.updated', 'Updated')}</th>
              <th className="px-6 py-4 text-right font-semibold">{t('admin.openPlatform.wechatOfficial.columns.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {loading ? (
              <BusinessStateTableRow colSpan={7} kind="loading" title={t('admin.openPlatform.wechatOfficial.states.accountsLoading', 'Loading WeChat official accounts...')} />
            ) : visibleAccounts.length === 0 ? (
              <BusinessStateTableRow
                colSpan={7}
                description={t('admin.openPlatform.wechatOfficial.states.accountsEmptyDesc', 'Create a WeChat official account before configuring menus and messages.')}
                kind="empty"
                title={t('admin.openPlatform.wechatOfficial.states.accountsEmpty', 'No WeChat official accounts')}
              />
            ) : visibleAccounts.map((account) => (
              <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={account.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-slate-200">{account.name}</div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-400">
                    <span>{account.key}</span>
                    <CopyButton text={account.key} iconClassName="h-3.5 w-3.5" title={t('admin.openPlatform.wechatOfficial.actions.copyKey', 'Copy account key')} />
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{account.appId || '-'}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1 font-mono text-xs">
                    <div>{account.tokenRef || '-'}</div>
                    <div>{account.secretRef || '-'}</div>
                    <div>{account.aesKeyRef || '-'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">{account.qrDefault ? t('common.yes', 'Yes') : t('common.no', 'No')}</td>
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

function MenusSection({
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
  accounts: WechatOfficialAccountItem[];
  accountsLoading: boolean;
  entries: WechatOfficialEntryItem[];
  entriesError: string | null;
  entriesLoading: boolean;
  onCreateEntry: () => void;
  onDeleteEntry: (entry: DeleteEntryTarget) => void;
  onEditEntry: (entry: WechatOfficialEntryItem) => void;
  onRefresh: () => void;
  selectedAccount: WechatOfficialAccountItem | null;
  selectedAccountId: string;
  setSelectedAccountId: (value: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-0 flex-1 flex-col" data-admin-open-platform-wechat-official-menus="true">
      <div className="flex shrink-0 flex-col gap-3 px-5 pt-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <h4 className="font-semibold text-slate-900 dark:text-white">{t('admin.openPlatform.wechatOfficial.menuTitle', 'Official Account Menu Management')}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('admin.openPlatform.wechatOfficial.menuSubtitle', 'Configure URL and QR entries that can be mapped to official account menus or login entry points.')}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            className="min-w-72 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-emerald-500 disabled:opacity-60 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
            disabled={accountsLoading || accounts.length === 0}
            onChange={(event) => setSelectedAccountId(event.target.value)}
            value={selectedAccountId}
          >
            {accounts.length === 0 ? (
              <option value="">{t('admin.openPlatform.wechatOfficial.states.noAccountOption', 'No official account')}</option>
            ) : accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            disabled={!selectedAccountId}
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${entriesLoading ? 'animate-spin' : ''}`} />
            {t('admin.openPlatform.wechatOfficial.actions.refresh', 'Refresh')}
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!selectedAccountId}
            onClick={onCreateEntry}
            type="button"
          >
            <Plus className="h-4 w-4" />
            {t('admin.openPlatform.wechatOfficial.actions.createMenu', 'Create Menu Entry')}
          </button>
        </div>
      </div>

      {entriesError ? (
        <BusinessStatePanel
          className="min-h-[320px]"
          description={entriesError}
          kind="error"
          onRetry={onRefresh}
          retryLabel={t('admin.openPlatform.wechatOfficial.actions.refresh', 'Refresh')}
          title={t('admin.openPlatform.wechatOfficial.states.menusError', 'WeChat official account menu entries could not be loaded')}
        />
      ) : (
        <AdminTableShell className="m-5 mt-4 rounded-xl" viewportProps={{ 'data-admin-open-platform-wechat-official-menus-table': true }}>
          <table className="w-full min-w-[920px] text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-white/10 dark:bg-[#121212] dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.menuKey', 'Menu Key')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.menuType', 'Type')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.menuUrl', 'URL')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.status', 'Status')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.openPlatform.wechatOfficial.columns.updated', 'Updated')}</th>
                <th className="px-6 py-4 text-right font-semibold">{t('admin.openPlatform.wechatOfficial.columns.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {entriesLoading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title={t('admin.openPlatform.wechatOfficial.states.menusLoading', 'Loading menu entries...')} />
              ) : !selectedAccount ? (
                <BusinessStateTableRow
                  colSpan={6}
                  description={t('admin.openPlatform.wechatOfficial.states.menusNeedAccountDesc', 'Create an official account before managing menus.')}
                  kind="empty"
                  title={t('admin.openPlatform.wechatOfficial.states.menusNeedAccount', 'Select an official account')}
                />
              ) : entries.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={6}
                  description={t('admin.openPlatform.wechatOfficial.states.menusEmptyDesc', 'Add URL or QR entries for this official account.')}
                  kind="empty"
                  title={t('admin.openPlatform.wechatOfficial.states.menusEmpty', 'No menu entries')}
                />
              ) : entries.map((entry) => (
                <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-white/5" key={entry.id}>
                  <td className="px-6 py-4 font-mono text-xs">{entry.key}</td>
                  <td className="px-6 py-4">{formatEntryType(entry.type, t)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="max-w-[420px] truncate">{entry.url}</span>
                      <CopyButton text={entry.url} iconClassName="h-3.5 w-3.5" title={t('admin.openPlatform.wechatOfficial.actions.copyUrl', 'Copy URL')} />
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

function MessagesSection({
  accounts,
  loading,
  onRefresh,
}: {
  accounts: WechatOfficialAccountItem[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  return (
    <section className="flex min-h-0 flex-1 flex-col" data-admin-open-platform-wechat-official-messages="true">
      <div className="flex shrink-0 flex-col gap-3 px-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{t('admin.openPlatform.wechatOfficial.messageTitle', 'Official Account Message Management')}</h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t('admin.openPlatform.wechatOfficial.messageSubtitle', 'Prepare message management as an independent official account module while the backend SDK contract is completed.')}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {t('admin.openPlatform.wechatOfficial.actions.refresh', 'Refresh')}
        </button>
      </div>
      <div className="m-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 dark:border-white/10 dark:bg-white/5">
        <div className="flex max-w-3xl gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              {t('admin.openPlatform.wechatOfficial.states.messagesContractTitle', 'Message contract is not exposed by the backend SDK yet')}
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {t('admin.openPlatform.wechatOfficial.states.messagesContractDesc', '公众号消息管理已经作为独立模块接入菜单和路由；当前 generated backend SDK 只提供 openPlatform accounts 和 entries 能力，未发现公众号消息列表、回复规则或模板消息发布接口，因此这里不使用手写 HTTP 绕过 SDK 边界。')}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryPill label={t('admin.openPlatform.wechatOfficial.summary.accounts', 'Accounts')} value={accounts.length} />
              <SummaryPill label={t('admin.openPlatform.wechatOfficial.summary.active', 'Active')} value={accounts.filter((account) => account.status === 'active').length} />
              <SummaryPill label={t('admin.openPlatform.wechatOfficial.summary.readyRoutes', 'Ready Routes')} value={3} />
            </div>
          </div>
        </div>
      </div>
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
          icon={<KeyRound className="h-4 w-4" />}
          kicker={t('admin.openPlatform.wechatOfficial.kicker', '公众号')}
          onClose={onClose}
          title={isEdit ? t('admin.openPlatform.wechatOfficial.form.editAccountTitle', 'Edit official account') : t('admin.openPlatform.wechatOfficial.form.createAccountTitle', 'Create official account')}
        />
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {formError ? <FormError message={formError} /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput disabled={isEdit} label={t('admin.openPlatform.wechatOfficial.form.key', 'Account key')} mono onChange={(value) => updateDraft({ key: value })} value={draft.key} />
            <TextInput label={t('admin.openPlatform.wechatOfficial.form.name', 'Account name')} onChange={(value) => updateDraft({ name: value })} value={draft.name} />
            <TextInput label={t('admin.openPlatform.wechatOfficial.form.appId', 'App ID')} mono onChange={(value) => updateDraft({ appId: value })} value={draft.appId} />
            {isEdit ? (
              <SelectInput label={t('admin.openPlatform.wechatOfficial.form.status', 'Status')} onChange={(value) => updateDraft({ status: value as WechatOfficialAccountStatus })} value={draft.status}>
                <option value="active">{t('admin.openPlatform.status.active', 'Active')}</option>
                <option value="inactive">{t('admin.openPlatform.status.inactive', 'Inactive')}</option>
              </SelectInput>
            ) : null}
            <TextInput label={t('admin.openPlatform.wechatOfficial.form.tokenRef', 'Token ref')} mono onChange={(value) => updateDraft({ tokenRef: value })} placeholder={t('admin.openPlatform.wechatOfficial.form.tokenRefPlaceholder', 'secret://wechat/official/default-token')} value={draft.tokenRef} />
            <TextInput hint={t('admin.openPlatform.wechatOfficial.form.credentialRefHint', 'Use vault:// or secret://. Short paths are saved as secret:// paths.')} label={t('admin.openPlatform.wechatOfficial.form.secretRef', 'Secret ref')} mono onChange={(value) => updateDraft({ secretRef: value })} placeholder={t('admin.openPlatform.wechatOfficial.form.secretRefPlaceholder', 'secret://wechat/official/default-secret')} value={draft.secretRef} />
            <TextInput className="md:col-span-2" label={t('admin.openPlatform.wechatOfficial.form.aesKeyRef', 'AES key ref')} mono onChange={(value) => updateDraft({ aesKeyRef: value })} placeholder={t('admin.openPlatform.wechatOfficial.form.aesKeyRefPlaceholder', 'secret://wechat/official/default-aes-key')} value={draft.aesKeyRef} />
            {isEdit ? (
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <input
                  checked={draft.qrDefault}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  onChange={(event) => updateDraft({ qrDefault: event.target.checked })}
                  type="checkbox"
                />
                {t('admin.openPlatform.wechatOfficial.form.qrDefault', 'Default QR account')}
              </label>
            ) : null}
          </div>
        </div>
        <DialogActions onClose={onClose} saving={saving} saveLabel={isEdit ? t('common.actions.save', 'Save') : t('admin.openPlatform.wechatOfficial.actions.createAccount', 'Create Account')} />
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
          icon={<MenuSquare className="h-4 w-4" />}
          kicker={t('admin.openPlatform.wechatOfficial.menus', 'Menus')}
          onClose={onClose}
          title={isEdit ? t('admin.openPlatform.wechatOfficial.form.editMenuTitle', 'Edit menu entry') : t('admin.openPlatform.wechatOfficial.form.createMenuTitle', 'Create menu entry')}
        />
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {formError ? <FormError message={formError} /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label={t('admin.openPlatform.wechatOfficial.form.menuKey', 'Menu key')} mono onChange={(value) => updateDraft({ key: value })} value={draft.key} />
            <SelectInput label={t('admin.openPlatform.wechatOfficial.form.menuType', 'Menu type')} onChange={(value) => updateDraft({ type: value as WechatOfficialEntryType })} value={draft.type}>
              <option value="url">{t('admin.openPlatform.entryType.url', 'URL')}</option>
              <option value="qr">{t('admin.openPlatform.entryType.qr', 'QR')}</option>
              <option value="mini_app_url">{t('admin.openPlatform.entryType.mini_app_url', 'Mini Program URL')}</option>
            </SelectInput>
            <TextInput className="md:col-span-2" label={t('admin.openPlatform.wechatOfficial.form.menuUrl', 'Menu URL')} mono onChange={(value) => updateDraft({ url: value })} value={draft.url} />
            {isEdit ? (
              <SelectInput label={t('admin.openPlatform.wechatOfficial.form.status', 'Status')} onChange={(value) => updateDraft({ status: value as WechatOfficialEntryStatus })} value={draft.status}>
                <option value="active">{t('admin.openPlatform.status.active', 'Active')}</option>
                <option value="inactive">{t('admin.openPlatform.status.inactive', 'Inactive')}</option>
              </SelectInput>
            ) : null}
          </div>
        </div>
        <DialogActions onClose={onClose} saving={saving} saveLabel={isEdit ? t('common.actions.save', 'Save') : t('admin.openPlatform.wechatOfficial.actions.createMenu', 'Create Menu Entry')} />
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
        <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-500">
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
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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
  className = '',
  disabled = false,
  hint,
  label,
  mono = false,
  onChange,
  placeholder,
  value,
}: {
  className?: string;
  disabled?: boolean;
  hint?: string;
  label: string;
  mono?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <input
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-400 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white dark:disabled:bg-white/5 ${mono ? 'font-mono' : ''}`}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
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
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <select
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-500 dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white"
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

function isValidOpenPlatformKey(value: string): boolean {
  return value.length <= OPEN_PLATFORM_KEY_MAX_LENGTH && OPEN_PLATFORM_KEY_PATTERN.test(value);
}

function validateAccountCredentialRefs(draft: AccountDraft): AccountCredentialRefs | null {
  const credentialRefs = {
    tokenRef: normalizeCredentialRefInput(draft.tokenRef),
    secretRef: normalizeCredentialRefInput(draft.secretRef),
    aesKeyRef: normalizeCredentialRefInput(draft.aesKeyRef),
  };
  if (
    !isValidCredentialRef(credentialRefs.tokenRef) ||
    !isValidCredentialRef(credentialRefs.secretRef) ||
    !isValidCredentialRef(credentialRefs.aesKeyRef)
  ) {
    return null;
  }
  return credentialRefs;
}

function normalizeCredentialRefInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }
  if (trimmed.startsWith('vault://') || trimmed.startsWith('secret://')) {
    return trimmed;
  }
  if (trimmed.includes('://')) {
    return trimmed;
  }
  return `secret://${trimmed}`;
}

function isValidCredentialRef(value: string): boolean {
  if (!value) {
    return true;
  }
  if (value.length > CREDENTIAL_REF_MAX_LENGTH) {
    return false;
  }
  if (!(value.startsWith('vault://') || value.startsWith('secret://'))) {
    return false;
  }
  const locator = value.replace(/^(?:vault|secret):\/\//, '');
  return CREDENTIAL_REF_LOCATOR_PATTERN.test(locator) && locator.replace(/^\/+|\/+$/g, '').length > 0;
}

function isCredentialRefValidationErrorMessage(message: string): boolean {
  return (
    /\b(?:secretRef|tokenRef|aesKeyRef)\b.*(?:must start with vault:\/\/ or secret:\/\/|must include a non-empty locator)/i.test(message) ||
    /plaintext open platform secrets are not accepted/i.test(message)
  );
}

function SummaryCell({ label, tone = 'slate', value }: { label: string; tone?: 'emerald' | 'slate'; value: number }) {
  return (
    <div className="border-r border-slate-200 px-4 py-2 last:border-r-0 dark:border-white/10">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className={`font-semibold ${tone === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{value}</div>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#171717]">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="text-lg font-semibold text-slate-900 dark:text-white">{value}</div>
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

function formatEntryType(type: WechatOfficialEntryType, t: ReturnType<typeof useTranslation>['t']): string {
  const fallback: Record<WechatOfficialEntryType, string> = {
    url: 'URL',
    qr: 'QR',
    mini_app_url: 'Mini Program URL',
  };
  return t(`admin.openPlatform.entryType.${type}`, fallback[type]);
}
