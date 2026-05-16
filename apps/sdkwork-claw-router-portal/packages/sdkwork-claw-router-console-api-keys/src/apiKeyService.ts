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
import type { CreateApiKeyRequest } from '@sdkwork/clawrouter-app-sdk';
import type { AppApiKeyListResponse as SdkAppApiKeyListResponse } from '@sdkwork/clawrouter-app-sdk';

export interface ApiKey {
  id: SdkAppApiKeyListResponse['items'][number]['id'];
  name: SdkAppApiKeyListResponse['items'][number]['name'];
  maskedKey: string & SdkAppApiKeyListResponse['items'][number]['maskedKey'];
  group: SdkAppApiKeyListResponse['items'][number]['group'];
  rate: SdkAppApiKeyListResponse['items'][number]['rate'];
  quota: SdkAppApiKeyListResponse['items'][number]['quota'];
  usedQuota: SdkAppApiKeyListResponse['items'][number]['usedQuota'];
  modalities: SdkAppApiKeyListResponse['items'][number]['modalities'];
  ipLimit: SdkAppApiKeyListResponse['items'][number]['ipLimit'];
  created: SdkAppApiKeyListResponse['items'][number]['created'];
  expires: SdkAppApiKeyListResponse['items'][number]['expires'];
  status: SdkAppApiKeyListResponse['items'][number]['status'];
}

export interface ApiKeyGroup {
  id: SdkAppApiKeyListResponse['groups'][number]['id'];
  code: SdkAppApiKeyListResponse['groups'][number]['code'];
  name: SdkAppApiKeyListResponse['groups'][number]['name'];
  rate: SdkAppApiKeyListResponse['groups'][number]['rate'];
}

export interface ApiKeyPageData {
  keys: ApiKey[];
  groups: SdkAppApiKeyListResponse['groups'];
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
const UNRESTRICTED_MODALITIES: ApiKeyModality[] = ['text', 'image', 'video', 'audio', 'music'];

export class ApiKeyService {
  static async fetchKeys(): Promise<ApiKeyPageData> {
    try {
      const result = await getClawRouterAppSdkClient().iam.apiKeys.list();
      ensurePlusApiSuccess(result, 'Failed to fetch API keys');
      const items = readRequiredApiItems(result, 'Failed to fetch API keys');
      const groups = readRequiredApiItems(result, 'Failed to fetch API key groups', ['groups']);

      return {
        keys: items.map(normalizeApiKey),
        groups: groups.map(normalizeApiKeyGroup),
      };
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'Failed to fetch API keys'));
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
      const key = normalizeApiKey(readRequiredApiItem(result, 'API key creation response is missing key data', ['item']));
      const rawKey = readString(data, 'rawKey');
      if (!rawKey) {
        throw new Error('API key creation response is missing key material');
      }
      return { key, rawKey };
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'Failed to create API key'));
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
    group: requiredText(input.group, 'group'),
    quota: decimalQuota(input.quota),
    isUnlimitedQuota: Boolean(input.isUnlimitedQuota),
    modalities: toApiKeyModalities(input.modalities),
    ipLimit: optionalText(input.ipLimit) ?? 'unrestricted',
    expires: optionalText(input.expires) ?? 'never',
  };
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
  const maskedKey = readRequiredString(value, 'maskedKey', 'API key masked value is required');

  return {
    id,
    name: readRequiredString(value, 'name', 'API key name is required'),
    maskedKey,
    group: readRequiredString(value, 'group', 'API key group is required'),
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

function readApiKeyModalities(value: Record<string, unknown>): SdkAppApiKeyListResponse['items'][number]['modalities'] {
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

function readApiKeyStatus(value: Record<string, unknown>): SdkAppApiKeyListResponse['items'][number]['status'] {
  const status = readRequiredString(value, 'status', 'API key status is required');
  if (status === 'enabled' || status === 'disabled') {
    return status;
  }
  throw new Error(`Unsupported API key status: ${status}`);
}
