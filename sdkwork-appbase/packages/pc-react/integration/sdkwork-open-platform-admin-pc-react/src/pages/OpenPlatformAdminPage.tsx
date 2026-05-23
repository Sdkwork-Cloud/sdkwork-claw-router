import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle2,
  KeyRound,
  Link2,
  Loader2,
  Plus,
  QrCode,
  RefreshCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import type {
  SdkworkOpenPlatformAdminAccount,
  SdkworkOpenPlatformAdminAccountInput,
  SdkworkOpenPlatformAdminAccountType,
} from "../open-platform-admin-service";
import type { SdkworkOpenPlatformAdminController } from "../open-platform-admin-controller";
import {
  useSdkworkOpenPlatformAdminController,
  useSdkworkOpenPlatformAdminControllerState,
} from "../open-platform-admin-controller";

export interface SdkworkOpenPlatformAdminPageProps {
  controller: SdkworkOpenPlatformAdminController;
}

type AccountFormState = {
  appId: string;
  key: string;
  name: string;
  provider: SdkworkOpenPlatformAdminAccount["provider"];
  secretRef: string;
};

const accountTypeTabs: Array<{
  icon: React.ReactNode;
  label: string;
  type: SdkworkOpenPlatformAdminAccountType;
}> = [
  { icon: <ShieldCheck className="h-4 w-4" />, label: "Official Accounts", type: "official_account" },
  { icon: <Smartphone className="h-4 w-4" />, label: "Mini Apps", type: "mini_app" },
];

const providerOptions: SdkworkOpenPlatformAdminAccount["provider"][] = [
  "wechat",
  "douyin",
  "alipay",
  "baidu",
  "kuaishou",
  "feishu",
];

export function SdkworkOpenPlatformAdminPage({
  controller: controllerProp,
}: SdkworkOpenPlatformAdminPageProps) {
  const controller = useSdkworkOpenPlatformAdminController(controllerProp);
  const state = useSdkworkOpenPlatformAdminControllerState(controller);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<AccountFormState>(() => createAccountFormState());
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!state.isBootstrapped && !state.isLoading && !state.lastError) {
      void controller.bootstrap().catch(() => undefined);
    }
  }, [controller, state.isBootstrapped, state.isLoading, state.lastError]);

  const accounts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return state.dashboard.accounts
      .filter((account) => account.type === state.activeType)
      .filter((account) => {
        if (!normalizedQuery) {
          return true;
        }
        return [account.name, account.key, account.provider, account.appId, account.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      });
  }, [query, state.activeType, state.dashboard.accounts]);

  const selectedAccount = useMemo(() => {
    if (state.selectedAccountId) {
      return accounts.find((account) => account.id === state.selectedAccountId) ?? accounts[0] ?? null;
    }
    return accounts[0] ?? null;
  }, [accounts, state.selectedAccountId]);

  const selectedEntries = selectedAccount ? state.dashboard.entriesByAccountId[selectedAccount.id] ?? [] : [];
  const selectedPayBindings = selectedAccount ? state.dashboard.payBindingsByAccountId[selectedAccount.id] ?? [] : [];
  const emptyMessage = state.activeType === "mini_app" ? "No mini app accounts yet." : "No official accounts yet.";

  async function submitAccount(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setFormError(null);
    const input: SdkworkOpenPlatformAdminAccountInput = {
      key: form.key.trim(),
      name: form.name.trim(),
      provider: form.provider,
      type: state.activeType,
      ...compactOptional({
        appId: form.appId,
        secretRef: form.secretRef,
      }),
    };

    if (!input.name || !input.key) {
      setFormError("Name and key are required.");
      return;
    }

    try {
      await controller.createAccount(input);
      setForm(createAccountFormState({ provider: form.provider }));
      setFormOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save account.");
    }
  }

  return (
    <section className="sdkwork-open-platform-admin min-h-full w-full bg-slate-50 text-slate-950 dark:bg-[#0a0a0a] dark:text-slate-50">
      <div className="flex w-full max-w-none flex-col gap-5" data-testid="open-platform-admin-workspace">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-white/10">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Open Platform Admin</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span>{state.dashboard.summary.officialAccounts} official</span>
              <span>{state.dashboard.summary.miniApps} mini apps</span>
              <span>{state.dashboard.summary.qrDefaultAccounts} QR defaults</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-white/10 dark:bg-[#121212] dark:text-slate-200 dark:shadow-none dark:hover:bg-white/10"
              onClick={() => void controller.refresh().catch(() => undefined)}
              type="button"
            >
              {state.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              Refresh
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 dark:bg-lobster-500 dark:shadow-none dark:hover:bg-lobster-400"
              onClick={() => {
                setForm(createAccountFormState({ provider: form.provider }));
                setFormOpen(true);
              }}
              type="button"
            >
              <Plus className="h-4 w-4" />
              New Account
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md border border-slate-300 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[#121212] dark:shadow-none">
            {accountTypeTabs.map((tab) => (
              <button
                className={[
                  "inline-flex h-9 items-center gap-2 rounded px-3 text-sm font-medium",
                  state.activeType === tab.type
                    ? "bg-slate-950 text-white dark:bg-lobster-500"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
                ].join(" ")}
                key={tab.type}
                onClick={() => controller.setAccountType(tab.type)}
                type="button"
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          <label className="flex h-10 min-w-64 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-[#121212] dark:text-slate-200 dark:shadow-none">
            <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span className="sr-only">Search</span>
            <input
              className="h-full min-w-0 flex-1 bg-transparent text-slate-900 outline-none placeholder:text-slate-400 dark:bg-[#121212] dark:text-slate-100 dark:placeholder:text-slate-500"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              value={query}
            />
          </label>
        </div>

        {state.lastError ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">{state.lastError}</div>
        ) : null}

        {formOpen ? (
          <form className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121212] dark:shadow-none" onSubmit={submitAccount}>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              <Field label="Name">
                <input
                  className={inputClassName}
                  id="open-platform-account-name"
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  value={form.name}
                />
              </Field>
              <Field label="Key">
                <input
                  className={inputClassName}
                  id="open-platform-account-key"
                  onChange={(event) => setForm((current) => ({ ...current, key: event.target.value }))}
                  value={form.key}
                />
              </Field>
              <Field label="Provider">
                <select
                  className={inputClassName}
                  id="open-platform-account-provider"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      provider: event.target.value as AccountFormState["provider"],
                    }))
                  }
                  value={form.provider}
                >
                  {providerOptions.map((provider) => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </Field>
              <Field label="App ID">
                <input
                  className={inputClassName}
                  id="open-platform-account-app-id"
                  onChange={(event) => setForm((current) => ({ ...current, appId: event.target.value }))}
                  value={form.appId}
                />
              </Field>
              <Field label="Secret Ref">
                <input
                  className={inputClassName}
                  id="open-platform-account-secret-ref"
                  onChange={(event) => setForm((current) => ({ ...current, secretRef: event.target.value }))}
                  value={form.secretRef}
                />
              </Field>
            </div>
            {formError ? <div className="text-sm text-red-700 dark:text-red-300">{formError}</div> : null}
            <div className="flex justify-end gap-2">
              <button
                className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#121212] dark:text-slate-200 dark:hover:bg-white/10"
                onClick={() => setFormOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-9 rounded-md bg-slate-950 px-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-lobster-500 dark:hover:bg-lobster-400"
                disabled={state.isMutating}
                type="submit"
              >
                Save
              </button>
            </div>
          </form>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section aria-label="Accounts" className="min-h-72 rounded-md border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#121212] dark:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <h2 className="text-base font-semibold tracking-normal">Accounts</h2>
              {state.isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-500 dark:text-slate-400" /> : null}
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {accounts.length > 0 ? accounts.map((account) => (
                <button
                  className={[
                    "grid w-full gap-2 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-white/5",
                    selectedAccount?.id === account.id ? "bg-slate-50 dark:bg-white/5" : "bg-white dark:bg-[#121212]",
                  ].join(" ")}
                  key={account.id}
                  onClick={() => controller.selectAccount(account.id)}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">{account.name}</div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">{account.key}</div>
                    </div>
                    <StatusBadge status={account.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1"><KeyRound className="h-3.5 w-3.5" />{account.provider}</span>
                    {account.appId ? <span>{account.appId}</span> : null}
                    {account.qrDefault ? <span className="text-emerald-700 dark:text-emerald-300">Default QR</span> : null}
                  </div>
                </button>
              )) : (
                <div className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</div>
              )}
            </div>
          </section>

          <section aria-label="Configuration" className="min-h-72 rounded-md border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#121212] dark:shadow-none">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
              <h2 className="text-base font-semibold tracking-normal">Configuration</h2>
              {selectedAccount ? (
                <div className="flex gap-2">
                  <button
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-white/10"
                    onClick={() => {
                      const defaultEntry = selectedEntries[0];
                      void controller
                        .setQrDefault(selectedAccount.id, defaultEntry?.id ?? selectedAccount.defaultEntryId ?? null)
                        .catch(() => undefined);
                    }}
                    type="button"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    Set QR
                  </button>
                  <button
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-white px-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-500/30 dark:bg-[#171717] dark:text-red-300 dark:hover:bg-red-500/10"
                    onClick={() => void controller.deleteAccount(selectedAccount.id).catch(() => undefined)}
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Disable
                  </button>
                </div>
              ) : null}
            </div>

            {selectedAccount ? (
              <div className="grid gap-4 p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoItem label="Name" value={selectedAccount.name} />
                  <InfoItem label="Provider" value={selectedAccount.provider} />
                  <InfoItem label="App ID" value={selectedAccount.appId || "-"} />
                  <InfoItem label="Secret Ref" value={selectedAccount.secretRef || "-"} />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Link2 className="h-4 w-4" />
                    Entries
                  </div>
                  {selectedEntries.length > 0 ? selectedEntries.map((entry) => (
                    <div className="grid gap-1 rounded-md border border-slate-200 px-3 py-2 dark:border-white/10 dark:bg-[#171717]" key={entry.id}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{entry.key}</span>
                        <StatusBadge status={entry.status} />
                      </div>
                      <div className="break-all text-xs text-slate-500 dark:text-slate-400">{entry.url}</div>
                    </div>
                  )) : (
                    <div className="rounded-md border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                      No login entries yet.
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <CheckCircle2 className="h-4 w-4" />
                    Pay Bindings
                  </div>
                  {selectedPayBindings.length > 0 ? selectedPayBindings.map((binding) => (
                    <div className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-white/10 dark:bg-[#171717]" key={binding.id}>
                      <span className="text-sm text-slate-900 dark:text-slate-100">{binding.paymentAccountId}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{binding.scene}</span>
                    </div>
                  )) : (
                    <div className="rounded-md border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                      No payment bindings yet.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">Select an account.</div>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  const id = React.isValidElement<{ id?: string }>(children) && typeof children.props.id === "string"
    ? children.props.id
    : undefined;
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={id}>
      {label}
      {children}
    </label>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border border-slate-200 px-3 py-2 dark:border-white/10 dark:bg-[#171717]">
      <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">{label}</span>
      <span className="break-all text-sm text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded px-2 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
          : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function createAccountFormState(input: Partial<AccountFormState> = {}): AccountFormState {
  return {
    appId: "",
    key: "",
    name: "",
    provider: "wechat",
    secretRef: "",
    ...input,
  };
}

function compactOptional(input: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(input)
      .map(([key, value]) => [key, value.trim()] as const)
      .filter(([, value]) => value.length > 0),
  );
}

const inputClassName =
  "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900 dark:border-white/10 dark:bg-[#171717] dark:text-slate-100 dark:focus:border-lobster-400";
