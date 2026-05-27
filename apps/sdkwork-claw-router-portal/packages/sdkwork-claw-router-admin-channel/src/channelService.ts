import {
  ensureSdkworkApiSuccess,
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
  ProviderCircuitBreakerPolicy,
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
  apiKey?: string;
  createdAt: string;
  expiresAt?: string;
  models: string[];
  capabilities: string[];
  isMultimodal: boolean;
  timeoutMs?: number;
  retryPolicy?: ProviderRetryPolicy;
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy;
  weight: number;
  status: 'active' | 'error' | 'disabled';
  balance: string;
  errors: number;
}

export interface ChannelModelCatalogItem {
  catalogKey: string;
  model: string;
  displayName: string;
  vendorCode: string;
  regionCode: string;
}

export type ChannelCreateInput = {
  name: string;
  vendor: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string;
  apiKey?: string;
  secretRef?: string;
  expiresAt?: string;
  models: string[];
  capabilities?: NonNullable<AdminChannelCreateRequest['capabilities']>;
  timeoutMs?: number;
  retryPolicy?: ProviderRetryPolicy;
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy;
  weight?: number;
  status?: AdminChannelCreateRequest['status'];
};

export type ChannelUpdateInput = {
  name?: string;
  vendor?: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string | null;
  apiKey?: string;
  secretRef?: string;
  expiresAt?: string | null;
  models?: string[];
  capabilities?: NonNullable<AdminChannelUpdateRequest['capabilities']>;
  timeoutMs?: number | null;
  retryPolicy?: ProviderRetryPolicy | null;
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy | null;
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
    ensureSdkworkApiSuccess(result, 'Failed to fetch channels');
    return readRequiredApiItems(result, 'Failed to fetch channels')
      .map(normalizeChannel);
  }

  static async addChannel(channel: ChannelCreateInput): Promise<ChannelItem> {
    const result = await channelBackendClient().integration.channels.create(
      toCreateChannelRequest(channel),
    );
    ensureSdkworkApiSuccess(result, 'Failed to add channel');
    return normalizeChannel(readRequiredApiItem(result, 'Created channel response is missing data'));
  }

  static async updateChannel(id: string, updates: ChannelUpdateInput): Promise<ChannelItem> {
    const channelId = requiredSafePathSegment(id, 'channelId');
    const result = await channelBackendClient().integration.channels.update(
      toUpdateChannelRequest(channelId, updates),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update channel');
    return normalizeChannel(readRequiredApiItem(result, 'Updated channel response is missing data'));
  }

  static async deleteChannel(id: string): Promise<boolean> {
    const result = await channelBackendClient().integration.channels.delete(requiredSafePathSegment(id, 'channelId'));
    ensureDeleteResult(result, 'Channel delete confirmation is required');
    return true;
  }

  static async testChannel(id: string): Promise<ChannelTestResult> {
    const channelId = requiredSafePathSegment(id, 'channelId');
    const result = await channelBackendClient().integration.channels.verify(
      channelId,
    );
    ensureSdkworkApiSuccess(result, 'Failed to test channel');
    const data = readApiRecord(result);
    return {
      channelId: readRequiredString(data, 'channelId', 'Channel test channel id is required'),
      success: readRequiredBoolean(data, 'success', 'Channel test success flag is required'),
      status: readChannelStatus(data),
      latency: readRequiredString(data, 'latency', 'Channel test latency is required'),
      item: normalizeChannel(readRequiredApiItem(result, 'Channel test response is missing channel data', ['item'])),
    };
  }
}

export class ChannelModelCatalogService {
  static async fetchModels(): Promise<ChannelModelCatalogItem[]> {
    const result = await channelBackendClient().ai.models.list();
    ensureSdkworkApiSuccess(result, 'Failed to fetch model catalog');
    return readRequiredApiItems(result, 'Failed to fetch model catalog')
      .map(normalizeModelCatalogItem)
      .filter((item): item is ChannelModelCatalogItem => item !== null);
  }
}

export class ProviderSecretService {
  static async fetchProviderSecrets(filter: Partial<Pick<ProviderSecretItem, 'providerCode' | 'status'>> = {}): Promise<ProviderSecretItem[]> {
    const result = await channelBackendClient().integration.providerSecrets.list(toProviderSecretListRequest(filter));
    ensureSdkworkApiSuccess(result, 'Failed to fetch provider credentials');
    return readRequiredApiItems(result, 'Failed to fetch provider credentials')
      .map(normalizeProviderSecret);
  }

  static async addProviderSecret(secret: ProviderSecretInput): Promise<ProviderSecretItem> {
    const result = await channelBackendClient().integration.providerSecrets.create(
      toCreateProviderSecretRequest(secret),
    );
    ensureSdkworkApiSuccess(result, 'Failed to add provider credential');
    return normalizeProviderSecret(readRequiredApiItem(result, 'Created provider credential response is missing data'));
  }

  static async updateProviderSecret(
    id: string,
    updates: ProviderSecretUpdateInput,
  ): Promise<ProviderSecretItem> {
    const providerSecretId = requiredSafePathSegment(id, 'providerSecretId');
    const result = await channelBackendClient().integration.providerSecrets.update(
      toUpdateProviderSecretRequest(providerSecretId, updates),
    );
    ensureSdkworkApiSuccess(result, 'Failed to update provider credential');
    return normalizeProviderSecret(readRequiredApiItem(result, 'Updated provider credential response is missing data'));
  }

  static async deleteProviderSecret(id: string): Promise<boolean> {
    const result = await channelBackendClient().integration.providerSecrets.delete(
      requiredSafePathSegment(id, 'providerSecretId'),
    );
    ensureDeleteResult(result, 'Provider credential delete confirmation is required');
    return true;
  }
}

function toCreateChannelRequest(channel: ChannelCreateInput): AdminChannelCreateRequest {
  const apiKey = optionalText(channel.apiKey);
  const secretRef = optionalText(channel.secretRef);
  if (!apiKey && !secretRef) {
    throw new Error('apiKey is required');
  }
  if (apiKey && secretRef) {
    throw new Error('channel credential must provide either apiKey or secretRef, not both');
  }
  const request = pruneUndefined({
    name: requiredText(channel.name, 'name'),
    vendor: requiredText(channel.vendor, 'vendor'),
    protocol: optionalText(channel.protocol),
    accessType: optionalText(channel.accessType),
    baseUrl: optionalText(channel.baseUrl),
    apiKey,
    secretRef,
    expiresAt: optionalText(channel.expiresAt),
    models: requiredCatalogModelKeys(channel.models, channel.vendor),
    capabilities: channel.capabilities === undefined ? undefined : toChannelCapabilities(channel.capabilities),
    timeoutMs: optionalInteger(channel.timeoutMs),
    retryPolicy: channel.retryPolicy,
    circuitBreakerPolicy: channel.circuitBreakerPolicy === undefined
      ? undefined
      : normalizeCircuitBreakerPolicy(channel.circuitBreakerPolicy),
    weight: optionalInteger(channel.weight),
    status: channel.status,
  });
  return apiKey
    ? { ...request, apiKey }
    : { ...request, apiKey: '', secretRef };
}

function toUpdateChannelRequest(id: string, updates: ChannelUpdateInput): AdminChannelUpdateRequest {
  return pruneUndefined({
    id,
    name: updates.name === undefined ? undefined : requiredText(updates.name, 'name'),
    vendor: updates.vendor === undefined ? undefined : requiredText(updates.vendor, 'vendor'),
    protocol: optionalText(updates.protocol),
    accessType: optionalText(updates.accessType),
    baseUrl: updates.baseUrl === undefined ? undefined : updates.baseUrl === null ? null : updates.baseUrl.trim(),
    apiKey: optionalText(updates.apiKey),
    secretRef: optionalText(updates.secretRef),
    expiresAt: updates.expiresAt === undefined ? undefined : updates.expiresAt === null ? null : updates.expiresAt.trim(),
    models: updates.models === undefined ? undefined : requiredCatalogModelKeys(updates.models, updates.vendor),
    capabilities: updates.capabilities === undefined ? undefined : toChannelCapabilities(updates.capabilities),
    timeoutMs: updates.timeoutMs === undefined ? undefined : optionalNullableInteger(updates.timeoutMs),
    retryPolicy: updates.retryPolicy,
    circuitBreakerPolicy: updates.circuitBreakerPolicy === undefined
      ? undefined
      : updates.circuitBreakerPolicy === null
        ? null
        : normalizeCircuitBreakerPolicy(updates.circuitBreakerPolicy),
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
  const normalized: NonNullable<AdminChannelCreateRequest['capabilities']> = [];
  for (const rawCapability of normalizedStringArray(capabilities)) {
    const capability = rawCapability.toLowerCase();
    if (!allowed.has(capability as NonNullable<AdminChannelCreateRequest['capabilities']>[number])) {
      throw new Error(`Unsupported channel capability: ${capability}`);
    }
    normalized.push(capability as NonNullable<AdminChannelCreateRequest['capabilities']>[number]);
  }
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

function requiredCatalogModelKeys(values: string[], vendor: string | undefined): string[] {
  return requiredStringArray(values, 'models').map((model) => toCatalogModelKey(model, vendor));
}

function toCatalogModelKey(model: string, vendor: string | undefined): string {
  const value = model.trim();
  if (isCatalogModelKey(value)) {
    return value;
  }
  return `${providerCodeForVendor(vendor ?? 'custom')}/global/${value}`;
}

export function providerCodeForVendor(vendor: string): string {
  const normalized = vendor.trim().toLowerCase();
  const mapping: Record<string, string> = {
    'azure openai': 'azure_openai',
    gemini: 'google',
    google: 'google',
    'google gemini': 'google',
    zhipuai: 'zhipu',
    'zhipu ai': 'zhipu',
    'mistral ai': 'mistral',
    'meta llama': 'meta',
  };
  return (mapping[normalized] ?? normalized.replace(/\s+/g, '_')).replace(/[^a-z0-9_-]/g, '') || 'custom';
}

export function isCatalogModelKey(value: string): boolean {
  const parts = value.trim().split('/');
  return parts.length >= 3 && parts.every((part) => part.trim().length > 0);
}

export function normalizeModelCatalogKey(model: string, vendor: string): string {
  return toCatalogModelKey(model, vendor);
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function requiredText(value: string | undefined, fieldName: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalInteger(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error('value must be a positive integer');
  }
  return value;
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

function ensureDeleteResult(result: unknown, message: string): void {
  ensureSdkworkApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
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
    secretRef: readOptionalString(item, 'secretRef'),
    apiKey: readOptionalString(item, 'apiKey'),
    createdAt: readRequiredString(item, 'createdAt', 'Channel created time is required'),
    expiresAt: readOptionalString(item, 'expiresAt'),
    models: readRequiredStringArray(item, 'models', 'Channel models are required'),
    capabilities: readRequiredStringArray(item, 'capabilities', 'Channel capabilities are required'),
    isMultimodal: readRequiredBoolean(item, 'isMultimodal', 'Channel multimodal flag is required'),
    timeoutMs: readOptionalNumber(item, 'timeoutMs'),
    retryPolicy: readRetryPolicy(item),
    circuitBreakerPolicy: readCircuitBreakerPolicy(item),
    weight: readRequiredNumber(item, 'weight', 'Channel weight is required'),
    status: readChannelStatus(item),
    balance: readRequiredString(item, 'balance', 'Channel balance is required'),
    errors: readRequiredNonNegativeInteger(item, 'errors', 'Channel errors are required'),
  };
}

function normalizeModelCatalogItem(value: unknown): ChannelModelCatalogItem | null {
  const item = readRequiredRecord(value, 'Model catalog record is required');
  const vendorCode = readRequiredString(item, 'vendorCode', 'Model catalog vendor code is required');
  const model = readRequiredString(item, 'model', 'Model catalog runtime model id is required');
  const runtimeCatalogKey = readOptionalString(item, 'catalogKey');
  const runtimeRegionCode = readOptionalString(item, 'regionCode');
  const regionCode = runtimeRegionCode ?? catalogRegionFromKey(runtimeCatalogKey) ?? 'global';
  const normalizedVendorCode = providerCodeForVendor(vendorCode);
  const catalogKey = runtimeCatalogKey && isCatalogModelKey(runtimeCatalogKey)
    ? runtimeCatalogKey
    : `${normalizedVendorCode}/${regionCode}/${model}`;
  return {
    catalogKey,
    model,
    displayName: readOptionalString(item, 'displayName') ?? readOptionalString(item, 'name') ?? model,
    vendorCode: normalizedVendorCode,
    regionCode,
  };
}

function catalogRegionFromKey(catalogKey: string | undefined): string | undefined {
  if (!catalogKey || !isCatalogModelKey(catalogKey)) {
    return undefined;
  }
  return catalogKey.split('/')[1];
}

function readOptionalString(item: ApiRecord, key: string): string | undefined {
  const value = readString(item, key).trim();
  return value.length > 0 ? value : undefined;
}

function readOptionalNumber(item: ApiRecord, key: string): number | undefined {
  if (!(key in item) || item[key] === null || item[key] === undefined || item[key] === '') {
    return undefined;
  }
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
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
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!isRecord(value)) {
    throw new Error('Channel retryPolicy must be an object');
  }
  const maxAttempts = readRequiredBoundedInteger(
    value,
    'maxAttempts',
    'Channel retryPolicy.maxAttempts is required',
    1,
    5,
  );
  const rawStatuses = value.retryableStatusCodes;
  if (!Array.isArray(rawStatuses)) {
    throw new Error('Channel retryPolicy.retryableStatusCodes is required');
  }
  const retryableStatusCodes = rawStatuses.map(readRetryableProviderStatus);
  return pruneUndefined({
    maxAttempts,
    retryableStatusCodes,
    backoffMs: readOptionalBoundedInteger(value, 'backoffMs', 0, 2000),
  });
}

function readCircuitBreakerPolicy(item: ApiRecord): ProviderCircuitBreakerPolicy | undefined {
  const value = item.circuitBreakerPolicy;
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!isRecord(value)) {
    throw new Error('Channel circuitBreakerPolicy must be an object');
  }
  return normalizeCircuitBreakerPolicy({
    failureThreshold: readRequiredBoundedInteger(
      value,
      'failureThreshold',
      'Channel circuitBreakerPolicy.failureThreshold must be between 1 and 100',
      1,
      100,
    ),
  });
}

function normalizeCircuitBreakerPolicy(value: ProviderCircuitBreakerPolicy): ProviderCircuitBreakerPolicy {
  if (!isRecord(value)) {
    throw new Error('circuitBreakerPolicy must be an object');
  }
  return {
    failureThreshold: boundedIntegerValue(
      value.failureThreshold,
      'circuitBreakerPolicy.failureThreshold',
      1,
      100,
    ),
  };
}

function boundedIntegerValue(value: unknown, fieldName: string, min: number, max: number): number {
  const number = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value)
      : Number.NaN;
  if (!Number.isSafeInteger(number) || number < min || number > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return number;
}

function readRetryableProviderStatus(status: unknown): ProviderRetryPolicy['retryableStatusCodes'][number] {
  const value = typeof status === 'number'
    ? status
    : typeof status === 'string' && status.trim()
      ? Number(status)
      : Number.NaN;
  if (
    !Number.isInteger(value)
    || ![408, 409, 425, 429, 500, 502, 503, 504].includes(value)
  ) {
    throw new Error(`Channel retryPolicy.retryableStatusCodes contains unsupported status: ${String(status)}`);
  }
  return value as ProviderRetryPolicy['retryableStatusCodes'][number];
}

function readOptionalBoundedInteger(item: ApiRecord, key: string, min: number, max: number): number | undefined {
  if (!(key in item) || item[key] === null || item[key] === undefined || item[key] === '') {
    return undefined;
  }
  return readRequiredBoundedInteger(item, key, `${key} must be between ${min} and ${max}`, min, max);
}

function readRequiredBoundedInteger(item: ApiRecord, key: string, message: string, min: number, max: number): number {
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
    throw new Error(message);
  }
  return value;
}

function readRequiredNonNegativeInteger(item: ApiRecord, key: string, message: string): number {
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new Error(message);
  }
  return value;
}

function readRequiredBoolean(item: ApiRecord, key: string, message: string): boolean {
  const value = item[key];
  if (typeof value !== 'boolean') {
    throw new Error(message);
  }
  return value;
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
