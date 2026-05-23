import type {
  PlatformAccountStatus,
  PlatformEntryStatus,
  PlatformEntryType,
  PlatformPayMode,
  PlatformPayScene,
  PlatformProvider,
} from "@sdkwork/platform";

export interface SdkworkOpenPlatformAdminBackendClient {
  openPlatform: {
    accounts: {
      create(input: SdkworkOpenPlatformAdminAccountInput): Promise<unknown>;
      delete(accountId: string): Promise<unknown>;
      entries: {
        create(accountId: string, input: SdkworkOpenPlatformAdminEntryInput): Promise<unknown>;
        delete(accountId: string, entryId: string): Promise<unknown>;
        list(accountId: string): Promise<unknown>;
        update(accountId: string, entryId: string, input: SdkworkOpenPlatformAdminEntryUpdateInput): Promise<unknown>;
      };
      list(params?: SdkworkOpenPlatformAdminAccountListParams): Promise<unknown>;
      payBindings: {
        create(accountId: string, input: SdkworkOpenPlatformAdminPayBindingInput): Promise<unknown>;
        delete(accountId: string, bindingId: string): Promise<unknown>;
        list(accountId: string): Promise<unknown>;
      };
      retrieve(accountId: string): Promise<unknown>;
      update(accountId: string, input: SdkworkOpenPlatformAdminAccountUpdateInput): Promise<unknown>;
    };
    manifests?: {
      list(params?: Record<string, unknown>): Promise<unknown>;
    };
    providers?: {
      list(params?: Record<string, unknown>): Promise<unknown>;
    };
  };
}
export type SdkworkOpenPlatformAdminAccountType = "mini_app" | "official_account";

export interface SdkworkOpenPlatformAdminAccount {
  aesKeyRef?: string | null;
  appId?: string | null;
  createdAt?: string;
  defaultEntryId?: string | null;
  id: string;
  key: string;
  name: string;
  provider: PlatformProvider;
  qrDefault: boolean;
  secretRef?: string | null;
  status: PlatformAccountStatus;
  tokenRef?: string | null;
  type: SdkworkOpenPlatformAdminAccountType;
  updatedAt?: string;
}

export interface SdkworkOpenPlatformAdminAccountInput {
  aesKeyRef?: string | null;
  appId?: string | null;
  key: string;
  name: string;
  provider: PlatformProvider;
  secretRef?: string | null;
  tokenRef?: string | null;
  type: SdkworkOpenPlatformAdminAccountType;
}

export interface SdkworkOpenPlatformAdminAccountUpdateInput {
  aesKeyRef?: string | null;
  appId?: string | null;
  defaultEntryId?: string | null;
  name?: string;
  qrDefault?: boolean;
  secretRef?: string | null;
  status?: PlatformAccountStatus;
  tokenRef?: string | null;
}

export interface SdkworkOpenPlatformAdminAccountListParams {
  provider?: PlatformProvider;
  status?: PlatformAccountStatus;
  type?: SdkworkOpenPlatformAdminAccountType;
}

export interface SdkworkOpenPlatformAdminEntry {
  accountId: string;
  createdAt?: string;
  id: string;
  key: string;
  status: PlatformEntryStatus;
  type: PlatformEntryType;
  updatedAt?: string;
  url: string;
}

export interface SdkworkOpenPlatformAdminEntryInput {
  key: string;
  type: PlatformEntryType;
  url: string;
}

export interface SdkworkOpenPlatformAdminEntryUpdateInput {
  key?: string;
  status?: PlatformEntryStatus;
  type?: PlatformEntryType;
  url?: string;
}

export interface SdkworkOpenPlatformAdminPayBinding {
  accountId: string;
  createdAt?: string;
  id: string;
  mode: PlatformPayMode;
  paymentAccountId: string;
  paymentChannelId?: string | null;
  scene: PlatformPayScene;
  status: PlatformAccountStatus;
  updatedAt?: string;
}

export interface SdkworkOpenPlatformAdminPayBindingInput {
  mode: PlatformPayMode;
  paymentAccountId: string;
  paymentChannelId?: string | null;
  scene: PlatformPayScene;
}

export interface SdkworkOpenPlatformAdminDashboard {
  accounts: SdkworkOpenPlatformAdminAccount[];
  entriesByAccountId: Record<string, SdkworkOpenPlatformAdminEntry[]>;
  payBindingsByAccountId: Record<string, SdkworkOpenPlatformAdminPayBinding[]>;
  summary: {
    activeAccounts: number;
    entries: number;
    miniApps: number;
    officialAccounts: number;
    payBindings: number;
    qrDefaultAccounts: number;
  };
}

export interface CreateSdkworkOpenPlatformAdminServiceOptions {
  backendClient: SdkworkOpenPlatformAdminBackendClient;
}

export interface SdkworkOpenPlatformAdminService {
  createAccount(input: SdkworkOpenPlatformAdminAccountInput): Promise<SdkworkOpenPlatformAdminAccount>;
  createEntry(accountId: string, input: SdkworkOpenPlatformAdminEntryInput): Promise<SdkworkOpenPlatformAdminEntry>;
  createPayBinding(
    accountId: string,
    input: SdkworkOpenPlatformAdminPayBindingInput,
  ): Promise<SdkworkOpenPlatformAdminPayBinding>;
  deleteAccount(accountId: string): Promise<SdkworkOpenPlatformAdminAccount>;
  deleteEntry(accountId: string, entryId: string): Promise<SdkworkOpenPlatformAdminEntry>;
  deletePayBinding(accountId: string, bindingId: string): Promise<SdkworkOpenPlatformAdminPayBinding>;
  getDashboard(): Promise<SdkworkOpenPlatformAdminDashboard>;
  listAccounts(params?: SdkworkOpenPlatformAdminAccountListParams): Promise<SdkworkOpenPlatformAdminAccount[]>;
  listEntries(accountId: string): Promise<SdkworkOpenPlatformAdminEntry[]>;
  listPayBindings(accountId: string): Promise<SdkworkOpenPlatformAdminPayBinding[]>;
  refreshDashboard(): Promise<SdkworkOpenPlatformAdminDashboard>;
  setQrDefault(accountId: string, entryId?: string | null): Promise<SdkworkOpenPlatformAdminAccount>;
  updateAccount(
    accountId: string,
    input: SdkworkOpenPlatformAdminAccountUpdateInput,
  ): Promise<SdkworkOpenPlatformAdminAccount>;
  updateEntry(
    accountId: string,
    entryId: string,
    input: SdkworkOpenPlatformAdminEntryUpdateInput,
  ): Promise<SdkworkOpenPlatformAdminEntry>;
}

type SdkMethod = (...args: any[]) => Promise<unknown>;

export function createSdkworkOpenPlatformAdminService(
  options: CreateSdkworkOpenPlatformAdminServiceOptions,
): SdkworkOpenPlatformAdminService {
  const client = options.backendClient;

  async function listAccounts(params?: SdkworkOpenPlatformAdminAccountListParams) {
    const payload = await callSdk(client, ["openPlatform", "accounts", "list"], toAccountListSdkParams(params));
    return extractItems(payload).map(toAccount).filter(isManagedAccount);
  }

  async function listEntries(accountId: string) {
    const payload = await callSdk(client, ["openPlatform", "accounts", "entries", "list"], accountId);
    return extractItems(payload).map(toEntry);
  }

  async function listPayBindings(accountId: string) {
    const payload = await callSdk(client, ["openPlatform", "accounts", "payBindings", "list"], accountId);
    return extractItems(payload).map(toPayBinding);
  }

  async function getDashboard(): Promise<SdkworkOpenPlatformAdminDashboard> {
    const accounts = await listAccounts();
    const entryPairs = await Promise.all(
      accounts.map(async (account) => [account.id, await listEntries(account.id)] as const),
    );
    const payBindingPairs = await Promise.all(
      accounts.map(async (account) => [account.id, await listPayBindings(account.id)] as const),
    );
    const entriesByAccountId = Object.fromEntries(entryPairs);
    const payBindingsByAccountId = Object.fromEntries(payBindingPairs);
    const entries = Object.values(entriesByAccountId).reduce((total, items) => total + items.length, 0);
    const payBindings = Object.values(payBindingsByAccountId).reduce((total, items) => total + items.length, 0);

    return {
      accounts,
      entriesByAccountId,
      payBindingsByAccountId,
      summary: {
        activeAccounts: accounts.filter((account) => account.status === "active").length,
        entries,
        miniApps: accounts.filter((account) => account.type === "mini_app").length,
        officialAccounts: accounts.filter((account) => account.type === "official_account").length,
        payBindings,
        qrDefaultAccounts: accounts.filter((account) => account.qrDefault).length,
      },
    };
  }

  return {
    async createAccount(input) {
      return toAccount(await callSdk(client, ["openPlatform", "accounts", "create"], compactRecord(input)));
    },
    async createEntry(accountId, input) {
      return toEntry(await callSdk(client, ["openPlatform", "accounts", "entries", "create"], accountId, input));
    },
    async createPayBinding(accountId, input) {
      return toPayBinding(
        await callSdk(client, ["openPlatform", "accounts", "payBindings", "create"], accountId, compactRecord(input)),
      );
    },
    async deleteAccount(accountId) {
      return toAccount(await callSdk(client, ["openPlatform", "accounts", "delete"], accountId));
    },
    async deleteEntry(accountId, entryId) {
      return toEntry(await callSdk(client, ["openPlatform", "accounts", "entries", "delete"], accountId, entryId));
    },
    async deletePayBinding(accountId, bindingId) {
      return toPayBinding(
        await callSdk(client, ["openPlatform", "accounts", "payBindings", "delete"], accountId, bindingId),
      );
    },
    getDashboard,
    listAccounts,
    listEntries,
    listPayBindings,
    refreshDashboard: getDashboard,
    async setQrDefault(accountId, entryId) {
      return toAccount(
        await callSdk(
          client,
          ["openPlatform", "accounts", "update"],
          accountId,
          compactRecord({
            defaultEntryId: entryId,
            qrDefault: true,
          }),
        ),
      );
    },
    async updateAccount(accountId, input) {
      return toAccount(await callSdk(client, ["openPlatform", "accounts", "update"], accountId, compactRecord(input)));
    },
    async updateEntry(accountId, entryId, input) {
      return toEntry(
        await callSdk(client, ["openPlatform", "accounts", "entries", "update"], accountId, entryId, compactRecord(input)),
      );
    },
  };
}

function toAccountListSdkParams(params?: SdkworkOpenPlatformAdminAccountListParams): Record<string, unknown> | undefined {
  if (!params) {
    return undefined;
  }
  return compactRecord({
    provider: params.provider,
    status: params.status,
    type_: params.type,
  });
}

export function unwrapOpenPlatformAdminResponse<T>(value: unknown, fallbackMessage = "Open platform request failed."): T {
  if (!value || typeof value !== "object") {
    return value as T;
  }

  if (!("data" in value) && !("code" in value)) {
    return value as T;
  }

  const envelope = value as { code?: number | string; data?: T; message?: string; msg?: string };
  if (!isSuccessCode(envelope.code)) {
    throw new Error(String(envelope.message || envelope.msg || fallbackMessage).trim());
  }
  return (envelope.data ?? null) as T;
}

function callSdk(client: unknown, path: readonly string[], ...args: any[]): Promise<unknown> {
  const method = readMethod(client, path);
  const name = path.join(".");
  if (!method) {
    throw new Error(`Missing SDKWork open platform backend SDK resource: ${name}`);
  }
  return method(...args).then((payload) => unwrapOpenPlatformAdminResponse(payload, `${name} failed`));
}

function readMethod(root: unknown, path: readonly string[]): SdkMethod | null {
  let node: unknown = root;
  for (const segment of path) {
    if (!node || typeof node !== "object") {
      return null;
    }
    node = (node as Record<string, unknown>)[segment];
  }
  return typeof node === "function" ? (node as SdkMethod) : null;
}

function extractItems(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (!value || typeof value !== "object") {
    return [];
  }
  const record = value as { content?: unknown[]; items?: unknown[]; records?: unknown[] };
  return record.items ?? record.content ?? record.records ?? [];
}

function toAccount(value: unknown): SdkworkOpenPlatformAdminAccount {
  const record = toRecord(value);
  const type = readString(record, "type", "accountType", "account_type");
  if (type !== "mini_app" && type !== "official_account") {
    throw new Error(`Unsupported open platform admin account type: ${type}`);
  }
  return {
    aesKeyRef: readNullableString(record, "aesKeyRef", "aes_key_ref"),
    appId: readNullableString(record, "appId", "app_id"),
    createdAt: readOptionalString(record, "createdAt", "created_at"),
    defaultEntryId: readNullableString(record, "defaultEntryId", "default_entry_id"),
    id: readString(record, "id", "accountId", "account_id"),
    key: readString(record, "key", "accountKey", "account_key"),
    name: readString(record, "name"),
    provider: readString(record, "provider") as PlatformProvider,
    qrDefault: readBoolean(record, "qrDefault", "qr_default"),
    secretRef: readNullableString(record, "secretRef", "secret_ref"),
    status: (readOptionalString(record, "status") ?? "active") as PlatformAccountStatus,
    tokenRef: readNullableString(record, "tokenRef", "token_ref"),
    type,
    updatedAt: readOptionalString(record, "updatedAt", "updated_at"),
  };
}

function toEntry(value: unknown): SdkworkOpenPlatformAdminEntry {
  const record = toRecord(value);
  return {
    accountId: readString(record, "accountId", "account_id"),
    createdAt: readOptionalString(record, "createdAt", "created_at"),
    id: readString(record, "id", "entryId", "entry_id"),
    key: readString(record, "key", "entryKey", "entry_key"),
    status: (readOptionalString(record, "status") ?? "active") as PlatformEntryStatus,
    type: readString(record, "type", "entryType", "entry_type") as PlatformEntryType,
    updatedAt: readOptionalString(record, "updatedAt", "updated_at"),
    url: readString(record, "url", "targetUrl", "target_url"),
  };
}

function toPayBinding(value: unknown): SdkworkOpenPlatformAdminPayBinding {
  const record = toRecord(value);
  return {
    accountId: readString(record, "accountId", "account_id"),
    createdAt: readOptionalString(record, "createdAt", "created_at"),
    id: readString(record, "id", "bindingId", "binding_id"),
    mode: readString(record, "mode") as PlatformPayMode,
    paymentAccountId: readString(record, "paymentAccountId", "payment_account_id"),
    paymentChannelId: readNullableString(record, "paymentChannelId", "payment_channel_id"),
    scene: readString(record, "scene") as PlatformPayScene,
    status: (readOptionalString(record, "status") ?? "active") as PlatformAccountStatus,
    updatedAt: readOptionalString(record, "updatedAt", "updated_at"),
  };
}

function isManagedAccount(account: SdkworkOpenPlatformAdminAccount): boolean {
  return account.type === "official_account" || account.type === "mini_app";
}

function compactRecord<TRecord extends object>(record: TRecord): TRecord {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== ""),
  ) as TRecord;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function readString(record: Record<string, unknown>, ...keys: string[]): string {
  const value = readValue(record, keys);
  return typeof value === "string" ? value : String(value ?? "");
}

function readOptionalString(record: Record<string, unknown>, ...keys: string[]): string | undefined {
  const value = readValue(record, keys);
  if (value === null || value === undefined) {
    return undefined;
  }
  const normalized = typeof value === "string" ? value.trim() : String(value).trim();
  return normalized || undefined;
}

function readNullableString(record: Record<string, unknown>, ...keys: string[]): string | null {
  return readOptionalString(record, ...keys) ?? null;
}

function readBoolean(record: Record<string, unknown>, ...keys: string[]): boolean {
  const value = readValue(record, keys);
  return value === true || value === "true" || value === 1 || value === "1";
}

function readValue(record: Record<string, unknown>, keys: readonly string[]): unknown {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }
  return undefined;
}

function isSuccessCode(code: number | string | undefined): boolean {
  if (code === undefined || code === null) {
    return true;
  }
  const normalized = String(code).trim();
  return normalized === "0" || normalized === "200" || normalized === "2000";
}
