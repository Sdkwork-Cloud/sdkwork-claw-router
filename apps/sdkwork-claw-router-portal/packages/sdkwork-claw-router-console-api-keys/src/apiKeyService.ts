import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readRequiredApiItem,
  readApiRecord,
  readNullableString,
  readRequiredApiItems,
  readRequiredString,
  readString,
} from 'sdkwork-claw-router-commons/runtime';
import type { CreateApiKeyRequest, UpdateApiKeyRequest } from '@sdkwork/clawrouter-app-sdk';
import type {
  AppApiKeyGroupListResponse as SdkAppApiKeyGroupListResponse,
  AppApiKeyListResponse as SdkAppApiKeyListResponse,
} from '@sdkwork/clawrouter-app-sdk';
import { DEFAULT_API_KEY_GROUP } from './apiKeyForm';

type SdkAppApiKeyItem = SdkAppApiKeyListResponse['items'][number];

export interface ApiKey {
  id: SdkAppApiKeyListResponse['items'][number]['id'];
  name: SdkAppApiKeyItem['name'];
  displayName: string;
  maskedKey: string & SdkAppApiKeyItem['maskedKey'];
  copyableKey: string | null;
  group: SdkAppApiKeyItem['group'];
  groupName: SdkAppApiKeyItem['groupName'] | null;
  rate: SdkAppApiKeyItem['rate'];
  quota: SdkAppApiKeyItem['quota'];
  usedQuota: SdkAppApiKeyItem['usedQuota'];
  modalities: SdkAppApiKeyItem['modalities'];
  ipLimit: SdkAppApiKeyItem['ipLimit'];
  created: SdkAppApiKeyItem['created'];
  expires: SdkAppApiKeyItem['expires'];
  status: SdkAppApiKeyItem['status'];
}

export interface ApiKeyGroup {
  id: SdkAppApiKeyGroupListResponse['items'][number]['id'];
  code: SdkAppApiKeyGroupListResponse['items'][number]['code'];
  name: SdkAppApiKeyGroupListResponse['items'][number]['name'];
  rate: SdkAppApiKeyGroupListResponse['items'][number]['rate'];
}

export interface CreateApiKeyInput {
  name: string;
  group: string;
  quota: string;
  isUnlimitedQuota: boolean;
  modalities: string[];
  ipLimit: string;
  expires: string;
}

export interface CreatedApiKey {
  key: ApiKey;
  rawKey: string;
}

type ApiKeyModality = NonNullable<CreateApiKeyRequest['modalities']>[number];
type UpdateApiKeyInput = Partial<CreateApiKeyInput>;
const UNRESTRICTED_MODALITIES: ApiKeyModality[] = ['text', 'image', 'video', 'audio', 'music'];

export class ApiKeyService {
  static async fetchKeys(): Promise<ApiKey[]> {
    try {
      const result = await getClawRouterAppSdkClient().iam.apiKeys.list();
      ensurePlusApiSuccess(result, 'console.apiKeys.errors.loadFallback');
      const items = readRequiredApiItems(result, 'console.apiKeys.errors.loadFallback');

      return items.map(normalizeApiKey);
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.apiKeys.errors.loadFallback'));
    }
  }

  static async fetchGroups(): Promise<ApiKeyGroup[]> {
    try {
      const result = await getClawRouterAppSdkClient().iam.apiKeyGroups.list();
      ensurePlusApiSuccess(result, 'console.apiKeys.errors.loadGroupsFallback');
      const items = readRequiredApiItems(result, 'console.apiKeys.errors.loadGroupsFallback');

      return items.map(normalizeApiKeyGroup);
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.apiKeys.errors.loadGroupsFallback'));
    }
  }

  static async createKey(input: CreateApiKeyInput): Promise<CreatedApiKey> {
    const idempotencyKey = createRequestToken('create-api-key');
    const requestId = createRequestToken('request');
    try {
      const result = await getClawRouterAppSdkClient().iam.apiKeys.create(
        toCreateApiKeyRequest(input),
        { idempotencyKey, xRequestId: requestId },
      );

      const data = readApiRecord(result);
      const rawKey = readString(data, 'rawKey');
      if (!rawKey) {
        throw new Error('API key creation response is missing key material');
      }
      const key = normalizeCreatedApiKey(
        readRequiredApiItem(result, 'API key creation response is missing key data', ['item']),
        rawKey,
      );
      return { key, rawKey };
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.apiKeys.errors.createFallback'));
    }
  }

  static async updateKey(keyId: string, input: UpdateApiKeyInput): Promise<ApiKey> {
    const requestId = createRequestToken('request');
    try {
      const result = await getClawRouterAppSdkClient().iam.apiKeys.update(
        requiredText(keyId, 'apiKeyId'),
        toUpdateApiKeyRequest(input),
        { xRequestId: requestId },
      );
      const key = normalizeApiKey(readRequiredApiItem(result, 'API key update response is missing key data', ['item']));
      return key;
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.apiKeys.errors.updateFallback'));
    }
  }

  static async deleteKey(keyId: string): Promise<void> {
    try {
      const result = await getClawRouterAppSdkClient().iam.apiKeys.delete(requiredText(keyId, 'apiKeyId'));
      ensurePlusApiSuccess(result, 'console.apiKeys.errors.deleteFallback');
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.apiKeys.errors.deleteFallback'));
    }
  }
}

function readSdkErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message && message !== 'Unknown error') {
      return message;
    }
  }
  return fallback;
}

function toCreateApiKeyRequest(input: CreateApiKeyInput): CreateApiKeyRequest {
  return {
    name: requiredText(input.name, 'name'),
    group: optionalText(input.group) ?? DEFAULT_API_KEY_GROUP,
    quota: decimalQuota(input.quota),
    isUnlimitedQuota: Boolean(input.isUnlimitedQuota),
    modalities: toApiKeyModalities(input.modalities),
    ipLimit: optionalText(input.ipLimit) ?? 'unrestricted',
    expires: optionalText(input.expires) ?? 'never',
  };
}

function toUpdateApiKeyRequest(input: UpdateApiKeyInput): UpdateApiKeyRequest {
  const request: UpdateApiKeyRequest = {};
  if (input.name !== undefined) {
    request.name = requiredText(input.name, 'name');
  }
  if (input.group !== undefined) {
    request.group = optionalText(input.group) ?? DEFAULT_API_KEY_GROUP;
  }
  if (input.quota !== undefined) {
    request.quota = decimalQuota(input.quota);
  }
  if (input.isUnlimitedQuota !== undefined) {
    request.isUnlimitedQuota = Boolean(input.isUnlimitedQuota);
  }
  if (input.modalities !== undefined) {
    request.modalities = toApiKeyModalities(input.modalities);
  }
  if (input.ipLimit !== undefined) {
    request.ipLimit = optionalText(input.ipLimit) ?? 'unrestricted';
  }
  if (input.expires !== undefined) {
    request.expires = optionalText(input.expires) ?? 'never';
  }
  return request;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function decimalQuota(value: string): string {
  const normalized = requiredText(value, 'quota').replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,6})?$/.test(normalized)) {
    throw new Error('quota must be a non-negative decimal');
  }
  return normalized;
}

function normalizeApiKey(value: unknown): ApiKey {
  if (!isRecord(value)) {
    throw new Error('API key record is required');
  }

  const id = readRequiredString(value, 'id', 'API key id is required');
  const name = readRequiredString(value, 'name', 'API key name is required');
  const maskedKey = readRequiredString(value, 'maskedKey', 'API key masked value is required');

  return {
    id,
    name,
    displayName: readApiKeyDisplayName(id, name),
    maskedKey,
    copyableKey: readNullableString(value, 'copyableKey'),
    group: readRequiredString(value, 'group', 'API key group is required'),
    groupName: readNullableString(value, 'groupName'),
    rate: readNullableString(value, 'rate'),
    quota: readRequiredString(value, 'quota', 'API key quota is required'),
    usedQuota: readRequiredString(value, 'usedQuota', 'API key used quota is required'),
    modalities: readApiKeyModalities(value),
    ipLimit: readRequiredString(value, 'ipLimit', 'API key IP limit is required'),
    created: readRequiredString(value, 'created', 'API key created time is required'),
    expires: readRequiredString(value, 'expires', 'API key expiration is required'),
    status: readApiKeyStatus(value),
  };
}

function readApiKeyDisplayName(id: string, name: string): string {
  const normalized = name.trim();
  if (!normalized) {
    return `API Key #${id}`;
  }
  return normalized;
}

function normalizeCreatedApiKey(value: unknown, rawKey: string): ApiKey {
  try {
    const key = normalizeApiKey(value);
    if (key.copyableKey && key.copyableKey !== rawKey) {
      throw new Error('API key creation response copyable key does not match raw key material');
    }
    return { ...key, copyableKey: rawKey };
  } catch (error) {
    if (
      error instanceof Error
      && error.message === 'API key creation response copyable key does not match raw key material'
    ) {
      throw error;
    }
    throw new Error('API key creation response is missing key data');
  }
}

function normalizeApiKeyGroup(value: unknown): ApiKeyGroup {
  if (!isRecord(value)) {
    throw new Error('API key group record is required');
  }

  return {
    id: readRequiredString(value, 'id', 'API key group id is required'),
    code: readRequiredString(value, 'code', 'API key group code is required'),
    name: readRequiredString(value, 'name', 'API key group name is required'),
    rate: readNullableString(value, 'rate'),
  };
}

function toApiKeyModalities(values: string[]): ApiKeyModality[] {
  const modalities: ApiKeyModality[] = [];
  for (const value of values) {
    const modality = value.trim().toLowerCase();
    if (!modality) {
      continue;
    }
    if (!isApiKeyModality(modality)) {
      throw new Error(`Unsupported API key modality: ${modality}`);
    }
    if (!modalities.includes(modality)) {
      modalities.push(modality);
    }
  }
  if (modalities.length === 0) {
    throw new Error('modalities must include at least one item');
  }
  return modalities;
}

function isApiKeyModality(value: string): value is ApiKeyModality {
  return (UNRESTRICTED_MODALITIES as readonly string[]).includes(value);
}

function readApiKeyModalities(value: Record<string, unknown>): SdkAppApiKeyItem['modalities'] {
  const raw = value.modalities;
  if (!Array.isArray(raw)) {
    throw new Error('API key modalities are required');
  }
  const modalities: ApiKeyModality[] = [];
  for (const item of raw) {
    const modality = typeof item === 'string' ? item.trim().toLowerCase() : '';
    if (!modality) {
      throw new Error('API key modalities are required');
    }
    if (!isApiKeyModality(modality)) {
      throw new Error(`Unsupported API key modality: ${modality}`);
    }
    modalities.push(modality);
  }
  if (modalities.length === 0) {
    throw new Error('API key modalities are required');
  }
  return [...new Set(modalities)];
}

function readApiKeyStatus(value: Record<string, unknown>): SdkAppApiKeyItem['status'] {
  const status = readRequiredString(value, 'status', 'API key status is required');
  if (status === 'enabled' || status === 'disabled') {
    return status;
  }
  throw new Error(`Unsupported API key status: ${status}`);
}
