import type { CreateApiKeyInput } from './apiKeyService';

export type ApiKeyFormValues = {
  name: string;
  group: string;
  quota: string;
  isUnlimitedQuota: boolean;
  modalities: string[];
  ipLimit: string;
  expires: string;
  createCount: number;
};

export const DEFAULT_API_KEY_MODALITIES = ['text', 'image', 'video', 'audio', 'music'] as const;

type ApiKeyModality = (typeof DEFAULT_API_KEY_MODALITIES)[number];

const DEFAULT_API_KEY_NAME = 'API key';
const DEFAULT_API_KEY_GROUP = 'default';
const DEFAULT_API_KEY_QUOTA = '0.000000';
const DEFAULT_IP_LIMIT = 'unrestricted';
const DEFAULT_EXPIRATION = 'never';
const MAX_BATCH_CREATE_COUNT = 100;

export function createApiKeyInputFromForm(values: ApiKeyFormValues, _index = 0): CreateApiKeyInput {
  return {
    name: normalizeOptionalText(values.name, DEFAULT_API_KEY_NAME),
    group: normalizeOptionalText(values.group, DEFAULT_API_KEY_GROUP),
    quota: normalizeQuota(values.quota, values.isUnlimitedQuota),
    isUnlimitedQuota: values.isUnlimitedQuota,
    modalities: normalizeModalities(values.modalities),
    ipLimit: normalizeOptionalText(values.ipLimit, DEFAULT_IP_LIMIT),
    expires: normalizeOptionalText(values.expires, DEFAULT_EXPIRATION),
  };
}

export function createApiKeyInputsFromForm(values: ApiKeyFormValues): CreateApiKeyInput[] {
  const count = normalizeCreateCount(values.createCount);
  const baseName = normalizeOptionalText(values.name, DEFAULT_API_KEY_NAME);

  return Array.from({ length: count }, (_, index) => ({
    ...createApiKeyInputFromForm({
      ...values,
      name: count > 1 ? `${baseName} ${index + 1}` : baseName,
    }),
  }));
}

function normalizeOptionalText(value: string, fallback: string): string {
  const text = value.trim();
  return text.length > 0 ? text : fallback;
}

function normalizeQuota(value: string, isUnlimitedQuota: boolean): string {
  if (isUnlimitedQuota) {
    return DEFAULT_API_KEY_QUOTA;
  }

  const text = value.trim();
  if (!/^\d+(?:\.\d+)?$/.test(text)) {
    return DEFAULT_API_KEY_QUOTA;
  }

  const parsed = Number(text);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_API_KEY_QUOTA;
  }

  return text;
}

function normalizeModalities(values: string[]): ApiKeyModality[] {
  const modalities = values
    .map((value) => value.trim().toLowerCase())
    .filter(isApiKeyModality);
  const uniqueModalities = [...new Set(modalities)];
  return uniqueModalities.length > 0 ? uniqueModalities : [...DEFAULT_API_KEY_MODALITIES];
}

function normalizeCreateCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(MAX_BATCH_CREATE_COUNT, Math.max(1, Math.trunc(value)));
}

function isApiKeyModality(value: string): value is ApiKeyModality {
  return (DEFAULT_API_KEY_MODALITIES as readonly string[]).includes(value);
}
