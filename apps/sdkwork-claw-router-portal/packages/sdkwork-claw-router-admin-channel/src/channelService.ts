import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readRequiredApiItem,
  readBoolean,
  readNumber,
  readRequiredNumber,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  readStringArray,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminChannelCreateRequest,
  AdminChannelUpdateRequest,
  AdminProviderSecretCreateRequest,
  AdminProviderSecretUpdateRequest,
  IntegrationProviderSecretsListParams,
  ProviderRetryPolicy,
} from '@sdkwork/clawrouter-backend-sdk';

export interface ChannelItem {
  id: string;
  name: string;
  vendor: string;
  protocol: string;
  accessType: string;
  baseUrl?: string;
  secretRef?: string;
  models: string[];
  capabilities: string[];
  isMultimodal: boolean;
  timeoutMs?: number;
  retryPolicy?: ProviderRetryPolicy;
  weight: number;
  status: 'active' | 'error' | 'disabled';
  balance: string;
  errors: number;
}

export type ChannelCreateInput = {
  name: string;
  vendor: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string;
  secretRef: string;
  models: string[];
  capabilities?: NonNullable<AdminChannelCreateRequest['capabilities']>;
  timeoutMs?: number;
  retryPolicy?: ProviderRetryPolicy;
  weight?: number;
  status?: AdminChannelCreateRequest['status'];
};

export type ChannelUpdateInput = {
  name?: string;
  vendor?: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string | null;
  secretRef?: string;
  models?: string[];
  capabilities?: NonNullable<AdminChannelUpdateRequest['capabilities']>;
  timeoutMs?: number | null;
  retryPolicy?: ProviderRetryPolicy | null;
  weight?: number;
  status?: AdminChannelUpdateRequest['status'];
};

export interface ChannelTestResult {
  channelId: string;
  success: boolean;
  status: ChannelItem['status'];
  latency: string;
  item: ChannelItem;
}

export interface ProviderSecretItem {
  id: string;
  providerCode: string;
  accountCode: string;
  name: string;
  authType: string;
  secretRef: string;
  maskedLabel: string;
  status: 'active' | 'disabled';
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSecretInput {
  providerCode: string;
  name: string;
  authType: string;
  secretRef: string;
  status?: 'active' | 'disabled';
}

export type ProviderSecretUpdateInput = {
  providerCode?: string;
  name?: string;
  authType?: string;
  secretRef?: string;
  status?: 'active' | 'disabled';
};

export class ChannelService {
  static async fetchChannels(): Promise<ChannelItem[]> {
    const result = await channelBackendClient().integration.channels.list();
    ensurePlusApiSuccess(result, 'Failed to fetch channels');
    return readRequiredApiItems(result, 'Failed to fetch channels')
      .map(normalizeChannel);
  }

  static async addChannel(channel: ChannelCreateInput): Promise<ChannelItem> {
    const result = await channelBackendClient().integration.channels.create(
      toCreateChannelRequest(channel),
      requestParams('admin-channel-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add channel');
    return normalizeChannel(readRequiredApiItem(result, 'Created channel response is missing data'));
  }

  static async updateChannel(id: string, updates: ChannelUpdateInput): Promise<ChannelItem> {
    const channelId = requiredSafePathSegment(id, 'channelId');
    const result = await channelBackendClient().integration.channels.update(
      toUpdateChannelRequest(channelId, updates),
      requestParams('admin-channel-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update channel');
    return normalizeChannel(readRequiredApiItem(result, 'Updated channel response is missing data'));
  }

  static async deleteChannel(id: string): Promise<boolean> {
    const result = await channelBackendClient().integration.channels.delete(requiredSafePathSegment(id, 'channelId'));
    ensurePlusApiSuccess(result, 'Failed to delete channel');
    return true;
  }

  static async testChannel(id: string): Promise<ChannelTestResult> {
    const channelId = requiredSafePathSegment(id, 'channelId');
    const result = await channelBackendClient().integration.channels.verify(
      channelId,
      requestParams('admin-channel-test'),
    );
    ensurePlusApiSuccess(result, 'Failed to test channel');
    const data = readApiRecord(result);
    return {
      channelId: readString(data, 'channelId') || channelId,
      success: readBoolean(data, 'success'),
      status: readChannelStatus(data),
      latency: readString(data, 'latency'),
      item: normalizeChannel(readRequiredApiItem(result, 'Channel test response is missing channel data', ['item'])),
    };
  }
}

export class ProviderSecretService {
  static async fetchProviderSecrets(filter: Partial<Pick<ProviderSecretItem, 'providerCode' | 'status'>> = {}): Promise<ProviderSecretItem[]> {
    const result = await channelBackendClient().integration.providerSecrets.list(toProviderSecretListRequest(filter));
    ensurePlusApiSuccess(result, 'Failed to fetch provider credentials');
    return readRequiredApiItems(result, 'Failed to fetch provider credentials')
      .map(normalizeProviderSecret);
  }

  static async addProviderSecret(secret: ProviderSecretInput): Promise<ProviderSecretItem> {
    const result = await channelBackendClient().integration.providerSecrets.create(
      toCreateProviderSecretRequest(secret),
      requestParams('admin-provider-secret-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add provider credential');
    return normalizeProviderSecret(readRequiredApiItem(result, 'Created provider credential response is missing data'));
  }

  static async updateProviderSecret(
    id: string,
    updates: ProviderSecretUpdateInput,
  ): Promise<ProviderSecretItem> {
    const providerSecretId = requiredSafePathSegment(id, 'providerSecretId');
    const result = await channelBackendClient().integration.providerSecrets.update(
      toUpdateProviderSecretRequest(providerSecretId, updates),
      requestParams('admin-provider-secret-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update provider credential');
    return normalizeProviderSecret(readRequiredApiItem(result, 'Updated provider credential response is missing data'));
  }

  static async deleteProviderSecret(id: string): Promise<boolean> {
    const result = await channelBackendClient().integration.providerSecrets.delete(
      requiredSafePathSegment(id, 'providerSecretId'),
    );
    ensurePlusApiSuccess(result, 'Failed to delete provider credential');
    return true;
  }
}

function toCreateChannelRequest(channel: ChannelCreateInput): AdminChannelCreateRequest {
  return pruneUndefined({
    name: requiredText(channel.name, 'name'),
    vendor: requiredText(channel.vendor, 'vendor'),
    protocol: optionalText(channel.protocol),
    accessType: optionalText(channel.accessType),
    baseUrl: optionalText(channel.baseUrl),
    secretRef: requiredText(channel.secretRef, 'secretRef'),
    models: requiredStringArray(channel.models, 'models'),
    capabilities: channel.capabilities === undefined ? undefined : toChannelCapabilities(channel.capabilities),
    timeoutMs: optionalInteger(channel.timeoutMs),
    retryPolicy: channel.retryPolicy,
    weight: optionalInteger(channel.weight),
    status: channel.status,
  });
}

function toUpdateChannelRequest(id: string, updates: ChannelUpdateInput): AdminChannelUpdateRequest {
  return pruneUndefined({
    id,
    name: updates.name === undefined ? undefined : requiredText(updates.name, 'name'),
    vendor: updates.vendor === undefined ? undefined : requiredText(updates.vendor, 'vendor'),
    protocol: optionalText(updates.protocol),
    accessType: optionalText(updates.accessType),
    baseUrl: updates.baseUrl === undefined ? undefined : updates.baseUrl === null ? null : updates.baseUrl.trim(),
    secretRef: optionalText(updates.secretRef),
    models: updates.models === undefined ? undefined : requiredStringArray(updates.models, 'models'),
    capabilities: updates.capabilities === undefined ? undefined : toChannelCapabilities(updates.capabilities),
    timeoutMs: updates.timeoutMs === undefined ? undefined : optionalNullableInteger(updates.timeoutMs),
    retryPolicy: updates.retryPolicy,
    weight: optionalInteger(updates.weight),
    status: updates.status,
  });
}

function toProviderSecretListRequest(
  filter: Partial<Pick<ProviderSecretItem, 'providerCode' | 'status'>>,
): IntegrationProviderSecretsListParams {
  return pruneUndefined({
    providerCode: optionalText(filter.providerCode),
    status: filter.status,
  });
}

function toCreateProviderSecretRequest(secret: ProviderSecretInput): AdminProviderSecretCreateRequest {
  return pruneUndefined({
    providerCode: requiredText(secret.providerCode, 'providerCode'),
    name: requiredText(secret.name, 'name'),
    authType: optionalText(secret.authType),
    secretRef: requiredText(secret.secretRef, 'secretRef'),
    status: secret.status,
  });
}

function toUpdateProviderSecretRequest(
  id: string,
  updates: ProviderSecretUpdateInput,
): AdminProviderSecretUpdateRequest {
  return pruneUndefined({
    id,
    providerCode: updates.providerCode === undefined ? undefined : requiredText(updates.providerCode, 'providerCode'),
    name: updates.name === undefined ? undefined : requiredText(updates.name, 'name'),
    authType: optionalText(updates.authType),
    secretRef: updates.secretRef === undefined ? undefined : requiredText(updates.secretRef, 'secretRef'),
    status: updates.status,
  });
}

function toChannelCapabilities(
  capabilities: string[],
): NonNullable<AdminChannelCreateRequest['capabilities']> | undefined {
  const allowed = new Set<NonNullable<AdminChannelCreateRequest['capabilities']>[number]>([
    'llm',
    'image',
    'audio',
    'music',
    'sfx',
    'video',
  ]);
  const normalized = normalizedStringArray(capabilities)
    .map((capability) => capability.toLowerCase())
    .filter((capability): capability is NonNullable<AdminChannelCreateRequest['capabilities']>[number] =>
      allowed.has(capability as NonNullable<AdminChannelCreateRequest['capabilities']>[number]),
    );
  return normalized.length > 0 ? normalized : undefined;
}

function normalizedStringArray(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function requiredStringArray(values: string[], fieldName: string): string[] {
  const normalized = normalizedStringArray(values);
  if (normalized.length === 0) {
    throw new Error(`${fieldName} must include at least one item`);
  }
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalInteger(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value) || value < 1) {
    throw new Error('value must be a positive integer');
  }
  return Math.round(value);
}

function optionalNullableInteger(value: number | null | undefined): number | null | undefined {
  if (value === null) {
    return null;
  }
  return optionalInteger(value);
}

function pruneUndefined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

function requestParams(scope: string): { xRequestId: string } {
  return { xRequestId: createRequestToken(scope) };
}

function channelBackendClient() {
  return getClawRouterBackendSdkClient();
}

function normalizeChannel(value: unknown): ChannelItem {
  const item = readRequiredRecord(value, 'Channel record is required');
  return {
    id: readRequiredString(item, 'id', 'Channel id is required'),
    name: readRequiredString(item, 'name', 'Channel name is required'),
    vendor: readRequiredString(item, 'vendor', 'Channel vendor is required'),
    protocol: readRequiredString(item, 'protocol', 'Channel protocol is required'),
    accessType: readRequiredString(item, 'accessType', 'Channel access type is required'),
    baseUrl: readOptionalString(item, 'baseUrl'),
    models: readRequiredStringArray(item, 'models', 'Channel models are required'),
    capabilities: readRequiredStringArray(item, 'capabilities', 'Channel capabilities are required'),
    isMultimodal: readBoolean(item, 'isMultimodal'),
    timeoutMs: readOptionalNumber(item, 'timeoutMs'),
    retryPolicy: readRetryPolicy(item),
    weight: readRequiredNumber(item, 'weight', 'Channel weight is required'),
    status: readChannelStatus(item),
    balance: readString(item, 'balance') || 'N/A',
    errors: readNumber(item, 'errors'),
  };
}

function readOptionalString(item: ApiRecord, key: string): string | undefined {
  const value = readString(item, key).trim();
  return value.length > 0 ? value : undefined;
}

function readOptionalNumber(item: ApiRecord, key: string): number | undefined {
  const value = readNumber(item, key);
  return value > 0 ? value : undefined;
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredStringArray(item: ApiRecord, key: string, message: string): string[] {
  const values = readStringArray(item, key);
  if (values.length === 0) {
    throw new Error(message);
  }
  return values;
}

function readRetryPolicy(item: ApiRecord): ProviderRetryPolicy | undefined {
  const value = item.retryPolicy;
  if (!isRecord(value)) {
    return undefined;
  }
  const retryableStatusCodes = Array.isArray(value.retryableStatusCodes)
    ? value.retryableStatusCodes
        .filter(isRetryableProviderStatus)
    : [];
  const maxAttempts = readNumber(value, 'maxAttempts');
  if (maxAttempts <= 0) {
    return undefined;
  }
  return pruneUndefined({
    maxAttempts,
    retryableStatusCodes,
    backoffMs: readOptionalNumber(value, 'backoffMs'),
  });
}

function isRetryableProviderStatus(
  status: unknown,
): status is ProviderRetryPolicy['retryableStatusCodes'][number] {
  return (
    typeof status === 'number' &&
    Number.isInteger(status) &&
    [408, 409, 425, 429, 500, 502, 503, 504].includes(status)
  );
}

function readChannelStatus(item: ApiRecord): 'active' | 'error' | 'disabled' {
  const status = readString(item, 'status');
  if (status === 'active' || status === 'error' || status === 'disabled') {
    return status;
  }
  throw new Error(status ? `Unsupported channel status: ${status}` : 'Channel status is required');
}

function normalizeProviderSecret(value: unknown): ProviderSecretItem {
  const item = readRequiredRecord(value, 'Provider credential record is required');
  const secretRef = readRequiredString(item, 'secretRef', 'Provider credential secret reference is required');
  return {
    id: readRequiredString(item, 'id', 'Provider credential id is required'),
    providerCode: readRequiredString(item, 'providerCode', 'Provider credential provider code is required'),
    accountCode: readRequiredString(item, 'accountCode', 'Provider credential account code is required'),
    name: readRequiredString(item, 'name', 'Provider credential name is required'),
    authType: readRequiredString(item, 'authType', 'Provider credential auth type is required'),
    secretRef,
    maskedLabel: readString(item, 'maskedLabel') || maskSecretRef(secretRef),
    status: readProviderSecretStatus(item),
    createdAt: readRequiredString(item, 'createdAt', 'Provider credential created time is required'),
    updatedAt: readRequiredString(item, 'updatedAt', 'Provider credential updated time is required'),
  };
}

function readProviderSecretStatus(item: ApiRecord): 'active' | 'disabled' {
  const status = readString(item, 'status');
  if (status === 'active' || status === 'disabled') {
    return status;
  }
  throw new Error(status ? `Unsupported provider credential status: ${status}` : 'Provider credential status is required');
}

function maskSecretRef(value: string): string {
  const leaf = value.split('/').filter(Boolean).pop();
  return leaf ? `ref:***${leaf}` : 'ref:***';
}
