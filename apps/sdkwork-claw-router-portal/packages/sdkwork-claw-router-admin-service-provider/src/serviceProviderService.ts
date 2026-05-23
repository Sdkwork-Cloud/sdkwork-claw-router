import {
  createRequestToken,
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readBoolean,
  readNullableString,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

type BackendOpenPlatform = ReturnType<typeof getClawRouterBackendSdkClient>['openPlatform'];
type OpenPlatformAccountCreateRequest = Parameters<BackendOpenPlatform['accounts']['create']>[0];

export type ServiceProviderCode = 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu';
export type ServiceProviderStatus = 'active' | 'inactive';
export type ServiceProviderAccountStatus = 'active' | 'inactive';
export type ServiceProviderAccountType = 'official_account' | 'mini_app' | 'life_account' | 'bot';

interface ServiceProviderItem {
  id: string;
  name: string;
  provider: ServiceProviderCode;
  status: ServiceProviderStatus;
}

export interface ServiceProviderAccountItem {
  id: string;
  key: string;
  name: string;
  provider: ServiceProviderCode;
  type: ServiceProviderAccountType;
  status: ServiceProviderAccountStatus;
  qrDefault: boolean;
  appId: string;
  tokenRef: string;
  secretRef: string;
  aesKeyRef: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceProviderAccountRow {
  providerId: string;
  providerCode: ServiceProviderCode;
  providerName: string;
  providerStatus: ServiceProviderStatus;
  account: ServiceProviderAccountItem | null;
}

export interface ServiceProviderAccountCreateInput {
  key: string;
  name: string;
  provider: ServiceProviderCode;
  type: ServiceProviderAccountType;
  appId?: string;
  tokenRef?: string;
  secretRef?: string;
  aesKeyRef?: string;
}

export class ServiceProviderAccountService {
  static async fetchAccounts(): Promise<ServiceProviderAccountRow[]> {
    const providersResult = await getClawRouterBackendSdkClient().openPlatform.providers.list();
    const accountsResult = await getClawRouterBackendSdkClient().openPlatform.accounts.list({ pageSize: 200 });
    const providers = readRequiredApiItems(providersResult, 'Service providers are required')
      .map(normalizeProvider);
    const accounts = readRequiredApiItems(accountsResult, 'Service provider accounts are required')
      .map(normalizeAccount);

    const accountByProvider = new Map<ServiceProviderCode, ServiceProviderAccountItem>();
    for (const account of accounts) {
      if (!accountByProvider.has(account.provider)) {
        accountByProvider.set(account.provider, account);
      }
    }

    return providers.map((provider) => ({
      providerId: provider.id,
      providerCode: provider.provider,
      providerName: provider.name,
      providerStatus: provider.status,
      account: accountByProvider.get(provider.provider) ?? null,
    }));
  }

  static async createAccount(input: ServiceProviderAccountCreateInput): Promise<ServiceProviderAccountItem> {
    const request: OpenPlatformAccountCreateRequest = {
      key: input.key.trim(),
      name: input.name.trim(),
      provider: input.provider,
      type: input.type,
      appId: optionalString(input.appId),
      tokenRef: optionalString(input.tokenRef),
      secretRef: optionalString(input.secretRef),
      aesKeyRef: optionalString(input.aesKeyRef),
    };
    const result = await getClawRouterBackendSdkClient().openPlatform.accounts.create(request, {
      xRequestId: createRequestToken('admin-service-provider-account-create'),
    });
    ensureSdkworkApiSuccess(result, 'Failed to create service provider account');
    return normalizeAccount(readRequiredApiItem(result, 'Service provider account is required'));
  }
}

function normalizeProvider(value: unknown): ServiceProviderItem {
  const item = readRequiredRecord(value, 'Service provider record is required');
  return {
    id: readRequiredString(item, 'id', 'Service provider id is required'),
    name: readRequiredString(item, 'name', 'Service provider name is required'),
    provider: readProviderCode(item, 'provider'),
    status: readProviderStatus(item, 'status'),
  };
}

function normalizeAccount(value: unknown): ServiceProviderAccountItem {
  const item = readRequiredRecord(value, 'Service provider account record is required');
  return {
    id: readRequiredString(item, 'id', 'Service provider account id is required'),
    key: readRequiredString(item, 'key', 'Service provider account key is required'),
    name: readRequiredString(item, 'name', 'Service provider account name is required'),
    provider: readProviderCode(item, 'provider'),
    type: readAccountType(item, 'type'),
    status: readAccountStatus(item, 'status'),
    qrDefault: readBoolean(item, 'qrDefault', false),
    appId: readNullableString(item, 'appId') ?? '',
    tokenRef: readNullableString(item, 'tokenRef') ?? '',
    secretRef: readNullableString(item, 'secretRef') ?? '',
    aesKeyRef: readNullableString(item, 'aesKeyRef') ?? '',
    createdAt: readString(item, 'createdAt'),
    updatedAt: readString(item, 'updatedAt'),
  };
}

function readProviderCode(record: ApiRecord, key: string): ServiceProviderCode {
  const value = readRequiredString(record, key, 'Service provider code is required');
  if (isProviderCode(value)) {
    return value;
  }
  throw new Error(`Unsupported service provider code: ${value}`);
}

function readProviderStatus(record: ApiRecord, key: string): ServiceProviderStatus {
  const value = readRequiredString(record, key, 'Service provider status is required');
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  throw new Error(`Unsupported service provider status: ${value}`);
}

function readAccountStatus(record: ApiRecord, key: string): ServiceProviderAccountStatus {
  const value = readRequiredString(record, key, 'Service provider account status is required');
  if (value === 'active' || value === 'inactive') {
    return value;
  }
  throw new Error(`Unsupported service provider account status: ${value}`);
}

function readAccountType(record: ApiRecord, key: string): ServiceProviderAccountType {
  const value = readRequiredString(record, key, 'Service provider account type is required');
  if (isAccountType(value)) {
    return value;
  }
  throw new Error(`Unsupported service provider account type: ${value}`);
}

function isProviderCode(value: string): value is ServiceProviderCode {
  return ['wechat', 'alipay', 'douyin', 'baidu', 'kuaishou', 'feishu'].includes(value);
}

function isAccountType(value: string): value is ServiceProviderAccountType {
  return ['official_account', 'mini_app', 'life_account', 'bot'].includes(value);
}

function optionalString(value: string | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
