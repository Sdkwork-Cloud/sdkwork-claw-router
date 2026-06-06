import {
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readBoolean,
  readNullableString,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  requiredSafePathSegment,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';

type BackendOpenPlatform = ReturnType<typeof getClawRouterBackendSdkClient>['openPlatform'];
type OpenPlatformAccountCreateRequest = Parameters<BackendOpenPlatform['accounts']['create']>[0];
type OpenPlatformAccountUpdateRequest = Parameters<BackendOpenPlatform['accounts']['update']>[1];
type OpenPlatformEntryCreateRequest = Parameters<BackendOpenPlatform['accounts']['entries']['create']>[1];
type OpenPlatformEntryUpdateRequest = Parameters<BackendOpenPlatform['accounts']['entries']['update']>[2];

export type WechatOfficialAccountStatus = 'active' | 'inactive';
export type WechatOfficialEntryStatus = 'active' | 'inactive';
export type WechatOfficialEntryType = 'url' | 'qr' | 'mini_app_url';

export interface WechatOfficialAccountItem {
  id: string;
  key: string;
  name: string;
  status: WechatOfficialAccountStatus;
  qrDefault: boolean;
  defaultEntryId: string;
  appId: string;
  hasAppSecret: boolean;
  hasToken: boolean;
  hasEncodingAesKey: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WechatOfficialEntryItem {
  id: string;
  accountId: string;
  key: string;
  type: WechatOfficialEntryType;
  url: string;
  status: WechatOfficialEntryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WechatOfficialAccountInput {
  key?: string;
  name: string;
  appId?: string;
  appSecret?: string;
  token?: string;
  encodingAesKey?: string;
}

export interface WechatOfficialAccountUpdateInput {
  name?: string;
  status?: WechatOfficialAccountStatus;
  qrDefault?: boolean;
  defaultEntryId?: string;
  appId?: string;
  appSecret?: string;
  token?: string;
  encodingAesKey?: string;
}

export interface WechatOfficialEntryInput {
  key: string;
  type: WechatOfficialEntryType;
  url: string;
}

export interface WechatOfficialEntryUpdateInput {
  key?: string;
  type?: WechatOfficialEntryType;
  url?: string;
  status?: WechatOfficialEntryStatus;
}

export class WechatOfficialAccountService {
  static async fetchAccounts(): Promise<WechatOfficialAccountItem[]> {
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.list({
      provider: 'wechat',
      type_: 'official_account',
      pageSize: '200',
    });
    return readRequiredApiItems(result, 'WeChat official accounts are required')
      .map(normalizeOfficialAccount);
  }

  static async createAccount(input: WechatOfficialAccountInput): Promise<WechatOfficialAccountItem> {
    const request: OpenPlatformAccountCreateRequest = {
      key: optionalPatchString(input.key) ?? buildOpenPlatformAccountKey('wechat.official', input.appId, input.name),
      name: input.name.trim(),
      provider: 'wechat',
      type: 'official_account',
      appId: optionalString(input.appId),
      appSecret: optionalString(input.appSecret),
      token: optionalString(input.token),
      encodingAesKey: optionalString(input.encodingAesKey),
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.create(request);
    ensureSdkworkApiSuccess(result, 'Failed to create WeChat official account');
    return normalizeOfficialAccount(readRequiredApiItem(result, 'WeChat official account is required'));
  }

  static async updateAccount(
    accountId: string,
    input: WechatOfficialAccountUpdateInput,
  ): Promise<WechatOfficialAccountItem> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const request: OpenPlatformAccountUpdateRequest = {
      name: optionalPatchString(input.name),
      status: input.status,
      qrDefault: input.qrDefault,
      defaultEntryId: optionalNullablePatchString(input.defaultEntryId),
      appId: optionalNullablePatchString(input.appId),
      appSecret: optionalPatchString(input.appSecret),
      token: optionalPatchString(input.token),
      encodingAesKey: optionalPatchString(input.encodingAesKey),
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.update(normalizedAccountId, request);
    ensureSdkworkApiSuccess(result, 'Failed to update WeChat official account');
    return normalizeOfficialAccount(readRequiredApiItem(result, 'WeChat official account is required'));
  }

  static async fetchEntries(accountId: string): Promise<WechatOfficialEntryItem[]> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.list(normalizedAccountId);
    return readRequiredApiItems(result, 'WeChat official account menu entries are required')
      .map(normalizeOfficialEntry);
  }

  static async createEntry(accountId: string, input: WechatOfficialEntryInput): Promise<WechatOfficialEntryItem> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const request: OpenPlatformEntryCreateRequest = {
      key: input.key.trim(),
      type: input.type,
      url: input.url.trim(),
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.create(normalizedAccountId, request);
    ensureSdkworkApiSuccess(result, 'Failed to create WeChat official account menu entry');
    return normalizeOfficialEntry(readRequiredApiItem(result, 'WeChat official account menu entry is required'));
  }

  static async updateEntry(
    accountId: string,
    entryId: string,
    input: WechatOfficialEntryUpdateInput,
  ): Promise<WechatOfficialEntryItem> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const normalizedEntryId = requiredSafePathSegment(entryId, 'entryId');
    const request: OpenPlatformEntryUpdateRequest = {
      key: optionalPatchString(input.key),
      type: input.type,
      url: optionalPatchString(input.url),
      status: input.status,
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.update(normalizedAccountId, normalizedEntryId, request);
    ensureSdkworkApiSuccess(result, 'Failed to update WeChat official account menu entry');
    return normalizeOfficialEntry(readRequiredApiItem(result, 'WeChat official account menu entry is required'));
  }

  static async deleteEntry(accountId: string, entryId: string): Promise<void> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const normalizedEntryId = requiredSafePathSegment(entryId, 'entryId');
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.delete(normalizedAccountId, normalizedEntryId);
    ensureSdkworkApiSuccess(result, 'Failed to delete WeChat official account menu entry');
  }
}

function normalizeOfficialAccount(value: unknown): WechatOfficialAccountItem {
  const item = readRequiredRecord(value, 'WeChat official account record is required');
  const provider = readRequiredString(item, 'provider', 'WeChat official account provider is required');
  const type = readRequiredString(item, 'type', 'WeChat official account type is required');
  if (provider !== 'wechat' || type !== 'official_account') {
    throw new Error(`Unsupported WeChat official account record: ${provider}/${type}`);
  }
  const tokenRef = readNullableString(item, 'tokenRef') ?? '';
  const secretRef = readNullableString(item, 'secretRef') ?? '';
  const aesKeyRef = readNullableString(item, 'aesKeyRef') ?? '';
  return {
    id: readRequiredString(item, 'id', 'WeChat official account id is required'),
    key: readRequiredString(item, 'key', 'WeChat official account key is required'),
    name: readRequiredString(item, 'name', 'WeChat official account name is required'),
    status: readAccountStatus(item, 'status'),
    qrDefault: readBoolean(item, 'qrDefault', false),
    defaultEntryId: readNullableString(item, 'defaultEntryId') ?? '',
    appId: readNullableString(item, 'appId') ?? '',
    hasAppSecret: secretRef.trim().length > 0,
    hasToken: tokenRef.trim().length > 0,
    hasEncodingAesKey: aesKeyRef.trim().length > 0,
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function normalizeOfficialEntry(value: unknown): WechatOfficialEntryItem {
  const item = readRequiredRecord(value, 'WeChat official account menu entry record is required');
  return {
    id: readRequiredString(item, 'id', 'WeChat official account menu entry id is required'),
    accountId: readRequiredString(item, 'accountId', 'WeChat official account menu entry account id is required'),
    key: readRequiredString(item, 'key', 'WeChat official account menu entry key is required'),
    type: readOfficialEntryType(item, 'type'),
    url: readRequiredString(item, 'url', 'WeChat official account menu entry URL is required'),
    status: readEntryStatus(item, 'status'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function readAccountStatus(record: ApiRecord, key: string): WechatOfficialAccountStatus {
  const value = readRequiredString(record, key, 'WeChat official account status is required');
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  throw new Error(`Unsupported WeChat official account status: ${value}`);
}

function readEntryStatus(record: ApiRecord, key: string): WechatOfficialEntryStatus {
  const value = readRequiredString(record, key, 'WeChat official account menu entry status is required');
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  throw new Error(`Unsupported WeChat official account menu entry status: ${value}`);
}

function readOfficialEntryType(record: ApiRecord, key: string): WechatOfficialEntryType {
  const value = readRequiredString(record, key, 'WeChat official account menu entry type is required');
  if (value === 'url' || value === 'qr' || value === 'mini_app_url') {
    return value;
  }
  throw new Error(`Unsupported WeChat official account menu entry type: ${value}`);
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function optionalString(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function optionalPatchString(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function optionalNullablePatchString(value: string | undefined): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  return optionalString(value);
}

function buildOpenPlatformAccountKey(prefix: string, appId: string | undefined, name: string): string {
  const source = optionalPatchString(appId) ?? optionalPatchString(name) ?? 'account';
  const normalized = source
    .toLowerCase()
    .replace(/[^a-z0-9._:-]+/g, '-')
    .replace(/^[^a-z0-9]+/, '')
    .replace(/[._:-]+$/g, '');
  const segment = normalized || 'account';
  const key = `${prefix}.${segment}`;
  return key.length <= 128 ? key : key.slice(0, 128).replace(/[._:-]+$/g, '') || `${prefix}.account`;
}
