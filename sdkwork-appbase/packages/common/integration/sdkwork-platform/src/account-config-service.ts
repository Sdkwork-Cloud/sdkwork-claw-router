import type { PlatformAccountType, PlatformEntryType, PlatformProvider, PlatformQrAuthPurpose } from "./platform-types";
import {
  assertPlatformAbsoluteUrl,
  assertPlatformMiniAppUrl,
  type PlatformQrAuthAccountSelection,
} from "./qr-auth-service";

export type PlatformAccountStatus = "active" | "inactive";
export type PlatformEntryStatus = "active" | "inactive";

export interface PlatformAccountRecord {
  aesKeyRef: string | null;
  appId: string | null;
  createdAt: string;
  defaultEntryId: string | null;
  id: string;
  key: string;
  name: string;
  provider: PlatformProvider;
  qrDefault: boolean;
  secretRef: string | null;
  status: PlatformAccountStatus;
  tokenRef: string | null;
  type: PlatformAccountType;
  updatedAt: string;
}

export interface PlatformEntryRecord {
  accountId: string;
  createdAt: string;
  id: string;
  key: string;
  status: PlatformEntryStatus;
  type: PlatformEntryType;
  updatedAt: string;
  url: string;
}

export interface PlatformAccountCreateInput {
  aesKeyRef?: string | null;
  appId?: string | null;
  key: string;
  name: string;
  provider: PlatformProvider;
  secretRef?: string | null;
  tokenRef?: string | null;
  type: PlatformAccountType;
}

export interface PlatformAccountListParams {
  provider?: PlatformProvider;
  qrDefault?: boolean;
  status?: PlatformAccountStatus;
  type?: PlatformAccountType;
}

export interface PlatformAccountUpdateInput {
  aesKeyRef?: string | null;
  appId?: string | null;
  defaultEntryId?: string | null;
  name?: string;
  qrDefault?: boolean;
  secretRef?: string | null;
  status?: PlatformAccountStatus;
  tokenRef?: string | null;
}

export interface PlatformEntryCreateInput {
  key: string;
  type: PlatformEntryType;
  url: string;
}

export interface PlatformEntryUpdateInput {
  key?: string;
  status?: PlatformEntryStatus;
  type?: PlatformEntryType;
  url?: string;
}

export interface PlatformListResult<TItem> {
  items: TItem[];
}

export interface PlatformAccountConfigStore {
  createAccount(input: PlatformAccountRecord): Promise<PlatformAccountRecord>;
  createEntry(input: PlatformEntryRecord): Promise<PlatformEntryRecord>;
  listAccounts(): Promise<PlatformListResult<PlatformAccountRecord>>;
  listEntries(accountId: string): Promise<PlatformListResult<PlatformEntryRecord>>;
  retrieveAccount(accountId: string): Promise<PlatformAccountRecord | null>;
  retrieveEntry(entryId: string): Promise<PlatformEntryRecord | null>;
  updateAccount(input: PlatformAccountRecord): Promise<PlatformAccountRecord>;
  updateAccounts(inputs: readonly PlatformAccountRecord[]): Promise<PlatformListResult<PlatformAccountRecord>>;
  updateEntry(input: PlatformEntryRecord): Promise<PlatformEntryRecord>;
}

export interface PlatformAccountConfigService {
  accounts: {
    create(input: PlatformAccountCreateInput): Promise<PlatformAccountRecord>;
    delete(accountId: string): Promise<PlatformAccountRecord>;
    entries: {
      create(accountId: string, input: PlatformEntryCreateInput): Promise<PlatformEntryRecord>;
      delete(accountId: string, entryId: string): Promise<PlatformEntryRecord>;
      list(accountId: string): Promise<PlatformListResult<PlatformEntryRecord>>;
      update(accountId: string, entryId: string, input: PlatformEntryUpdateInput): Promise<PlatformEntryRecord>;
    };
    list(params?: PlatformAccountListParams): Promise<PlatformListResult<PlatformAccountRecord>>;
    retrieve(accountId: string): Promise<PlatformAccountRecord>;
    update(accountId: string, input: PlatformAccountUpdateInput): Promise<PlatformAccountRecord>;
  };
}

export interface CreatePlatformAccountConfigServiceInput {
  now?: () => Date;
  randomId?: (prefix: string) => string;
  store: PlatformAccountConfigStore;
}

export function createPlatformAccountConfigService(
  input: CreatePlatformAccountConfigServiceInput,
): PlatformAccountConfigService {
  const now = input.now ?? (() => new Date());
  const randomId = input.randomId ?? createStableIdFactory();

  async function createAccount(createInput: PlatformAccountCreateInput): Promise<PlatformAccountRecord> {
    const accounts = await input.store.listAccounts();
    if (accounts.items.some((account) => account.key === createInput.key)) {
      throw new Error(`Platform account key already exists: ${createInput.key}`);
    }
    const current = now().toISOString();
    const account: PlatformAccountRecord = {
      id: randomId("account"),
      provider: createInput.provider,
      type: createInput.type,
      key: createInput.key,
      name: createInput.name,
      appId: normalizeOptionalString(createInput.appId),
      secretRef: normalizeOptionalString(createInput.secretRef),
      tokenRef: normalizeOptionalString(createInput.tokenRef),
      aesKeyRef: normalizeOptionalString(createInput.aesKeyRef),
      defaultEntryId: null,
      qrDefault: false,
      status: "active",
      createdAt: current,
      updatedAt: current,
    };
    return input.store.createAccount(account);
  }

  async function retrieveAccount(accountId: string): Promise<PlatformAccountRecord> {
    const account = await input.store.retrieveAccount(accountId);
    if (!account) {
      throw new Error(`Platform account not found: ${accountId}`);
    }
    return account;
  }

  async function listAccounts(params: PlatformAccountListParams = {}): Promise<PlatformListResult<PlatformAccountRecord>> {
    const accounts = await input.store.listAccounts();
    return {
      items: accounts.items.filter((account) => {
        if (params.provider && account.provider !== params.provider) {
          return false;
        }
        if (params.type && account.type !== params.type) {
          return false;
        }
        if (params.status && account.status !== params.status) {
          return false;
        }
        if (params.qrDefault !== undefined && account.qrDefault !== params.qrDefault) {
          return false;
        }
        return true;
      }),
    };
  }

  async function updateAccount(accountId: string, updateInput: PlatformAccountUpdateInput): Promise<PlatformAccountRecord> {
    const account = await retrieveAccount(accountId);
    const nextDefaultEntryId =
      "defaultEntryId" in updateInput ? updateInput.defaultEntryId ?? null : account.defaultEntryId;
    const current = now().toISOString();
    let next: PlatformAccountRecord = {
      ...account,
      ...("name" in updateInput ? { name: updateInput.name ?? account.name } : {}),
      ...("appId" in updateInput ? { appId: normalizeOptionalString(updateInput.appId) } : {}),
      ...("secretRef" in updateInput ? { secretRef: normalizeOptionalString(updateInput.secretRef) } : {}),
      ...("tokenRef" in updateInput ? { tokenRef: normalizeOptionalString(updateInput.tokenRef) } : {}),
      ...("aesKeyRef" in updateInput ? { aesKeyRef: normalizeOptionalString(updateInput.aesKeyRef) } : {}),
      ...("status" in updateInput && updateInput.status ? { status: updateInput.status } : {}),
      defaultEntryId: nextDefaultEntryId,
      qrDefault: updateInput.qrDefault ?? account.qrDefault,
      updatedAt: current,
    };
    if (next.status !== "active") {
      next = {
        ...next,
        defaultEntryId: null,
        qrDefault: false,
      };
    }

    if (next.qrDefault) {
      assertQrLoginAccountType(next.type);
      if (!next.defaultEntryId) {
        throw new Error("QR default platform account requires an active owned default entry");
      }
      const entry = await input.store.retrieveEntry(next.defaultEntryId);
      assertOwnedActiveEntry(next, entry);

      const accounts = await input.store.listAccounts();
      const demotedAccounts = accounts.items
        .filter((candidate) => candidate.id !== next.id && candidate.qrDefault)
        .map((candidate) => ({
          ...candidate,
          qrDefault: false,
          updatedAt: current,
        }));
      if (demotedAccounts.length > 0) {
        await input.store.updateAccounts(demotedAccounts);
      }
    }

    next = await input.store.updateAccount(next);
    return next;
  }

  async function deleteAccount(accountId: string): Promise<PlatformAccountRecord> {
    return updateAccount(accountId, { status: "inactive" });
  }

  async function createEntry(accountId: string, createInput: PlatformEntryCreateInput): Promise<PlatformEntryRecord> {
    await retrieveAccount(accountId);
    const entries = await input.store.listEntries(accountId);
    if (entries.items.some((entry) => entry.key === createInput.key)) {
      throw new Error(`Platform entry key already exists in account: ${createInput.key}`);
    }
    const current = now().toISOString();
    const entry: PlatformEntryRecord = {
      id: randomId("entry"),
      accountId,
      key: createInput.key,
      type: createInput.type,
      url: createInput.url,
      status: "active",
      createdAt: current,
      updatedAt: current,
    };
    return input.store.createEntry(entry);
  }

  async function listEntries(accountId: string): Promise<PlatformListResult<PlatformEntryRecord>> {
    await retrieveAccount(accountId);
    return input.store.listEntries(accountId);
  }

  async function requireOwnedEntry(account: PlatformAccountRecord, entryId: string): Promise<PlatformEntryRecord> {
    const entry = await input.store.retrieveEntry(entryId);
    if (!entry || entry.accountId !== account.id) {
      throw new Error(`Platform entry is not owned by account: ${entryId}`);
    }
    return entry;
  }

  async function updateEntry(
    accountId: string,
    entryId: string,
    updateInput: PlatformEntryUpdateInput,
  ): Promise<PlatformEntryRecord> {
    const account = await retrieveAccount(accountId);
    const entry = await requireOwnedEntry(account, entryId);
    const current = now().toISOString();
    const next: PlatformEntryRecord = {
      ...entry,
      ...(updateInput.key ? { key: updateInput.key } : {}),
      ...(updateInput.type ? { type: updateInput.type } : {}),
      ...(updateInput.url ? { url: updateInput.url } : {}),
      ...(updateInput.status ? { status: updateInput.status } : {}),
      updatedAt: current,
    };
    const updated = await input.store.updateEntry(next);
    if (account.defaultEntryId === updated.id && updated.status !== "active") {
      await input.store.updateAccount({
        ...account,
        defaultEntryId: null,
        qrDefault: false,
        updatedAt: current,
      });
    }
    return updated;
  }

  async function deleteEntry(accountId: string, entryId: string): Promise<PlatformEntryRecord> {
    return updateEntry(accountId, entryId, { status: "inactive" });
  }

  return {
    accounts: {
      create: createAccount,
      retrieve: retrieveAccount,
      list: listAccounts,
      update: updateAccount,
      delete: deleteAccount,
      entries: {
        create: createEntry,
        list: listEntries,
        update: updateEntry,
        delete: deleteEntry,
      },
    },
  };
}

export function createPlatformQrAuthDefaultAccountResolver(service: PlatformAccountConfigService) {
  return async (_purpose: PlatformQrAuthPurpose): Promise<PlatformQrAuthAccountSelection | null> => {
    const accounts = await service.accounts.list();
    const account = accounts.items.find((candidate) => candidate.status === "active" && candidate.qrDefault);
    if (!account) {
      return null;
    }
    assertQrLoginAccountType(account.type);
    if (!account.defaultEntryId) {
      return null;
    }
    const entries = await service.accounts.entries.list(account.id);
    const entry = entries.items.find((candidate) => candidate.id === account.defaultEntryId && candidate.status === "active");
    if (!entry) {
      return null;
    }
    return {
      accountId: account.id,
      entryId: entry.id,
      entryUrl: entry.url,
      provider: account.provider,
      type: account.type,
    };
  };
}

export function createPlatformAccountConfigMemoryStore(): PlatformAccountConfigStore {
  const accounts = new Map<string, PlatformAccountRecord>();
  const entries = new Map<string, PlatformEntryRecord>();

  return {
    async createAccount(account) {
      const cloned = cloneAccount(account);
      accounts.set(cloned.id, cloned);
      return cloneAccount(cloned);
    },
    async retrieveAccount(accountId) {
      const account = accounts.get(accountId);
      return account ? cloneAccount(account) : null;
    },
    async listAccounts() {
      return {
        items: [...accounts.values()].map(cloneAccount),
      };
    },
    async updateAccount(account) {
      if (!accounts.has(account.id)) {
        throw new Error(`Platform account not found: ${account.id}`);
      }
      const cloned = cloneAccount(account);
      accounts.set(cloned.id, cloned);
      return cloneAccount(cloned);
    },
    async updateAccounts(nextAccounts) {
      const updated: PlatformAccountRecord[] = [];
      for (const account of nextAccounts) {
        if (!accounts.has(account.id)) {
          throw new Error(`Platform account not found: ${account.id}`);
        }
        const cloned = cloneAccount(account);
        accounts.set(cloned.id, cloned);
        updated.push(cloneAccount(cloned));
      }
      return { items: updated };
    },
    async createEntry(entry) {
      const cloned = cloneEntry(entry);
      entries.set(cloned.id, cloned);
      return cloneEntry(cloned);
    },
    async retrieveEntry(entryId) {
      const entry = entries.get(entryId);
      return entry ? cloneEntry(entry) : null;
    },
    async listEntries(accountId) {
      return {
        items: [...entries.values()].filter((entry) => entry.accountId === accountId).map(cloneEntry),
      };
    },
    async updateEntry(entry) {
      if (!entries.has(entry.id)) {
        throw new Error(`Platform entry not found: ${entry.id}`);
      }
      const cloned = cloneEntry(entry);
      entries.set(cloned.id, cloned);
      return cloneEntry(cloned);
    },
  };
}

function assertQrLoginAccountType(
  type: PlatformAccountType,
): asserts type is Extract<PlatformAccountType, "mini_app" | "official_account"> {
  if (type !== "official_account" && type !== "mini_app") {
    throw new Error("QR auth default account must be an official account or mini app");
  }
}

function assertOwnedActiveEntry(account: PlatformAccountRecord, entry: PlatformEntryRecord | null): asserts entry is PlatformEntryRecord {
  if (!entry || entry.status !== "active") {
    throw new Error("QR default platform account requires an active owned default entry");
  }
  if (entry.accountId !== account.id) {
    throw new Error("QR default entry must be owned by account");
  }
  if (account.type === "mini_app" && entry.type !== "mini_app_url") {
    throw new Error("Mini app QR default entry must use mini_app_url");
  }
  if (account.type === "official_account") {
    assertPlatformAbsoluteUrl(entry.url, "official account entry URL");
  }
  if (account.type === "mini_app") {
    assertPlatformMiniAppUrl(entry.url, account.provider);
  }
}

function createStableIdFactory(): (prefix: string) => string {
  let sequence = 0;
  return (prefix: string) => {
    sequence += 1;
    return `${prefix}_${sequence}`;
  };
}

function cloneAccount(account: PlatformAccountRecord): PlatformAccountRecord {
  return { ...account };
}

function cloneEntry(entry: PlatformEntryRecord): PlatformEntryRecord {
  return { ...entry };
}

function normalizeOptionalString(value: string | null | undefined): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
