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
} from 'sdkwork-claw-router-commons/runtime';

type BackendOpenPlatform = ReturnType<typeof getClawRouterBackendSdkClient>['openPlatform'];
type OpenPlatformAccountCreateRequest = Parameters<BackendOpenPlatform['accounts']['create']>[0];
type OpenPlatformAccountUpdateRequest = Parameters<BackendOpenPlatform['accounts']['update']>[1];
type OpenPlatformEntryCreateRequest = Parameters<BackendOpenPlatform['accounts']['entries']['create']>[1];
type OpenPlatformEntryUpdateRequest = Parameters<BackendOpenPlatform['accounts']['entries']['update']>[2];

export type WechatMiniProgramStatus = 'active' | 'inactive';
export type WechatMiniProgramEntryStatus = 'active' | 'inactive';

export interface WechatMiniProgramItem {
  id: string;
  key: string;
  name: string;
  status: WechatMiniProgramStatus;
  qrDefault: boolean;
  defaultEntryId: string;
  appId: string;
  hasAppSecret: boolean;
  hasToken: boolean;
  hasEncodingAesKey: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WechatMiniProgramEntryItem {
  id: string;
  accountId: string;
  key: string;
  type: 'mini_app_url';
  url: string;
  status: WechatMiniProgramEntryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WechatMiniProgramInput {
  key?: string;
  name: string;
  appId?: string;
  appSecret?: string;
  token?: string;
  encodingAesKey?: string;
}

export interface WechatMiniProgramUpdateInput {
  name?: string;
  status?: WechatMiniProgramStatus;
  qrDefault?: boolean;
  defaultEntryId?: string;
  appId?: string;
  appSecret?: string;
  token?: string;
  encodingAesKey?: string;
}

export interface WechatMiniProgramEntryInput {
  key: string;
  url: string;
}

export interface WechatMiniProgramEntryUpdateInput {
  key?: string;
  url?: string;
  status?: WechatMiniProgramEntryStatus;
}

export class WechatMiniProgramService {
  static async fetchAccounts(): Promise<WechatMiniProgramItem[]> {
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.list({
      provider: 'wechat',
      type_: 'mini_app',
      pageSize: 200,
    });
    return readRequiredApiItems(result, 'WeChat mini programs are required')
      .map(normalizeMiniProgram);
  }

  static async createAccount(input: WechatMiniProgramInput): Promise<WechatMiniProgramItem> {
    const request: OpenPlatformAccountCreateRequest = {
      key: optionalPatchString(input.key) ?? buildOpenPlatformAccountKey('wechat.mini', input.appId, input.name),
      name: input.name.trim(),
      provider: 'wechat',
      type: 'mini_app',
      appId: optionalString(input.appId),
      appSecret: optionalString(input.appSecret),
      token: optionalString(input.token),
      encodingAesKey: optionalString(input.encodingAesKey),
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.create(request);
    ensureSdkworkApiSuccess(result, 'Failed to create WeChat mini program');
    return normalizeMiniProgram(readRequiredApiItem(result, 'WeChat mini program is required'));
  }

  static async updateAccount(
    accountId: string,
    input: WechatMiniProgramUpdateInput,
  ): Promise<WechatMiniProgramItem> {
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
    ensureSdkworkApiSuccess(result, 'Failed to update WeChat mini program');
    return normalizeMiniProgram(readRequiredApiItem(result, 'WeChat mini program is required'));
  }

  static async fetchEntries(accountId: string): Promise<WechatMiniProgramEntryItem[]> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.list(normalizedAccountId);
    return readRequiredApiItems(result, 'WeChat mini program URL entries are required')
      .map(normalizeMiniProgramEntry);
  }

  static async createEntry(accountId: string, input: WechatMiniProgramEntryInput): Promise<WechatMiniProgramEntryItem> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const request: OpenPlatformEntryCreateRequest = {
      key: input.key.trim(),
      type: 'mini_app_url',
      url: input.url.trim(),
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.create(normalizedAccountId, request);
    ensureSdkworkApiSuccess(result, 'Failed to create WeChat mini program URL entry');
    return normalizeMiniProgramEntry(readRequiredApiItem(result, 'WeChat mini program URL entry is required'));
  }

  static async updateEntry(
    accountId: string,
    entryId: string,
    input: WechatMiniProgramEntryUpdateInput,
  ): Promise<WechatMiniProgramEntryItem> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const normalizedEntryId = requiredSafePathSegment(entryId, 'entryId');
    const request: OpenPlatformEntryUpdateRequest = {
      key: optionalPatchString(input.key),
      type: 'mini_app_url',
      url: optionalPatchString(input.url),
      status: input.status,
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.update(normalizedAccountId, normalizedEntryId, request);
    ensureSdkworkApiSuccess(result, 'Failed to update WeChat mini program URL entry');
    return normalizeMiniProgramEntry(readRequiredApiItem(result, 'WeChat mini program URL entry is required'));
  }

  static async deleteEntry(accountId: string, entryId: string): Promise<void> {
    const normalizedAccountId = requiredSafePathSegment(accountId, 'accountId');
    const normalizedEntryId = requiredSafePathSegment(entryId, 'entryId');
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.entries.delete(normalizedAccountId, normalizedEntryId);
    ensureSdkworkApiSuccess(result, 'Failed to delete WeChat mini program URL entry');
  }
}

function normalizeMiniProgram(value: unknown): WechatMiniProgramItem {
  const item = readRequiredRecord(value, 'WeChat mini program record is required');
  const provider = readRequiredString(item, 'provider', 'WeChat mini program provider is required');
  const type = readRequiredString(item, 'type', 'WeChat mini program type is required');
  if (provider !== 'wechat' || type !== 'mini_app') {
    throw new Error(`Unsupported WeChat mini program record: ${provider}/${type}`);
  }
  const tokenRef = readNullableString(item, 'tokenRef') ?? '';
  const secretRef = readNullableString(item, 'secretRef') ?? '';
  const aesKeyRef = readNullableString(item, 'aesKeyRef') ?? '';
  return {
    id: readRequiredString(item, 'id', 'WeChat mini program id is required'),
    key: readRequiredString(item, 'key', 'WeChat mini program key is required'),
    name: readRequiredString(item, 'name', 'WeChat mini program name is required'),
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

function normalizeMiniProgramEntry(value: unknown): WechatMiniProgramEntryItem {
  const item = readRequiredRecord(value, 'WeChat mini program URL entry record is required');
  const type = readRequiredString(item, 'type', 'WeChat mini program URL entry type is required');
  if (type !== 'mini_app_url') {
    throw new Error(`Unsupported WeChat mini program URL entry type: ${type}`);
  }
  return {
    id: readRequiredString(item, 'id', 'WeChat mini program URL entry id is required'),
    accountId: readRequiredString(item, 'accountId', 'WeChat mini program URL entry account id is required'),
    key: readRequiredString(item, 'key', 'WeChat mini program URL entry key is required'),
    type: 'mini_app_url',
    url: readRequiredString(item, 'url', 'WeChat mini program URL entry URL is required'),
    status: readEntryStatus(item, 'status'),
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function readAccountStatus(record: ApiRecord, key: string): WechatMiniProgramStatus {
  const value = readRequiredString(record, key, 'WeChat mini program status is required');
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  throw new Error(`Unsupported WeChat mini program status: ${value}`);
}

function readEntryStatus(record: ApiRecord, key: string): WechatMiniProgramEntryStatus {
  const value = readRequiredString(record, key, 'WeChat mini program URL entry status is required');
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  throw new Error(`Unsupported WeChat mini program URL entry status: ${value}`);
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
