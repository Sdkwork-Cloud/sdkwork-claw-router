import type { RoutingChannelMutationInput, RoutingChannelUpdateInput } from './routingService';
import type { ChannelStatus } from './types';

export type RoutingChannelFormValues = {
  name: string;
  vendor: string;
  protocol: string;
  accessType: string;
  baseUrl: string;
  secretRef: string;
  models: string[];
  capabilities: string[];
  timeoutMs?: number | string | null;
  retryEnabled?: boolean;
  retryMaxAttempts?: number | string | null;
  retryableStatusCodes?: string[] | string | null;
  retryBackoffMs?: number | string | null;
  weight: number;
  status: string;
};

const ROUTING_CHANNEL_CAPABILITIES = ['llm', 'image', 'audio', 'music', 'sfx', 'video'] as const;
const RETRYABLE_STATUS_CODES = [408, 409, 425, 429, 500, 502, 503, 504] as const;

type RoutingChannelCapability = (typeof ROUTING_CHANNEL_CAPABILITIES)[number];
type RetryableStatusCode = (typeof RETRYABLE_STATUS_CODES)[number];
type SelectOption = {
  id: string;
  label?: string;
  title?: string;
  name?: string;
  aliases?: readonly string[];
};
type AuthTypeOption = {
  id: string;
  title: string;
  aliases?: readonly string[];
};

export function resolveRoutingSelectFormValue(
  value: string | undefined,
  options: readonly SelectOption[],
  fallback: string,
): string {
  const normalized = optionalText(value ?? '');
  if (!normalized) {
    return fallback;
  }
  return findOptionByWireValue(normalized, options)?.id ?? normalized;
}

export function resolveRoutingMultiProtocolFormValue(
  value: string | undefined,
  options: readonly SelectOption[],
  fallback: readonly string[],
): string[] {
  const rawItems = normalizedDelimitedText(value);
  if (rawItems.length === 0) {
    return [...fallback];
  }
  const resolved = rawItems.map((item) => findOptionByWireValue(item, options)?.id ?? item);
  return uniqueTextArray(resolved);
}

export function resolveRoutingMultiProtocolSubmitValue(
  values: readonly string[],
  options: readonly SelectOption[],
): string {
  const resolved = uniqueTextArray(
    values.map((value) => {
      const normalized = requiredText(value, 'protocol');
      return options.find((option) => option.id === normalized)?.label ?? normalized;
    }),
  );
  if (resolved.length === 0) {
    throw new Error('protocol is required');
  }
  return resolved.join(', ');
}

export function resolveRoutingAuthTypeFormValue(value: string | undefined, authTypes: readonly AuthTypeOption[]): string {
  const normalized = optionalText(value ?? '');
  if (!normalized) {
    return 'api-key';
  }
  const lowerValue = normalized.toLowerCase();
  return authTypes.find((type) => {
    const aliases = type.aliases ?? [];
    return type.id.toLowerCase() === lowerValue
      || type.title.toLowerCase() === lowerValue
      || aliases.some((alias) => alias.toLowerCase() === lowerValue);
  })?.id ?? normalized;
}

export function resolveRoutingAuthTypeSubmitValue(value: string, authTypes: readonly AuthTypeOption[]): string {
  const normalized = requiredText(value, 'authType');
  return authTypes.find((type) => type.id === normalized)?.title ?? normalized;
}

export function createRoutingChannelInputFromForm(values: RoutingChannelFormValues): RoutingChannelMutationInput {
  return omitUndefined({
    name: values.name.trim(),
    vendor: values.vendor.trim(),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    secretRef: values.secretRef.trim(),
    models: normalizedModels(values.models),
    capabilities: normalizedCapabilities(values.capabilities),
    timeoutMs: optionalInteger(values.timeoutMs, 'timeoutMs', 1, 600_000),
    retryPolicy: normalizeRetryPolicy(values, false),
    weight: requiredInteger(values.weight, 'weight', 1, 10_000),
    status: routingChannelStatus(values.status),
  });
}

export function createRoutingChannelUpdateInputFromForm(values: RoutingChannelFormValues): RoutingChannelUpdateInput {
  return omitUndefined({
    name: optionalText(values.name),
    vendor: optionalText(values.vendor),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    secretRef: optionalText(values.secretRef),
    models: normalizedModels(values.models),
    capabilities: normalizedCapabilities(values.capabilities),
    timeoutMs: 'timeoutMs' in values ? nullableInteger(values.timeoutMs, 'timeoutMs', 1, 600_000) : undefined,
    retryPolicy: 'retryEnabled' in values ? normalizeRetryPolicy(values, true) : undefined,
    weight: requiredInteger(values.weight, 'weight', 1, 10_000),
    status: routingChannelStatus(values.status),
  });
}

function normalizedModels(values: string[]): string[] {
  const models = normalizedTextArray(values);
  if (models.length === 0) {
    throw new Error('models must include at least one item');
  }
  return models;
}

function normalizedTextArray(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizedDelimitedText(value: string | undefined): string[] {
  return uniqueTextArray(String(value ?? '').split(','));
}

function uniqueTextArray(values: readonly string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function findOptionByWireValue(value: string, options: readonly SelectOption[]): SelectOption | undefined {
  const lowerValue = value.toLowerCase();
  return options.find((option) => {
    const aliases = option.aliases ?? [];
    return option.id.toLowerCase() === lowerValue
      || option.label?.toLowerCase() === lowerValue
      || option.title?.toLowerCase() === lowerValue
      || option.name?.toLowerCase() === lowerValue
      || aliases.some((alias) => alias.toLowerCase() === lowerValue);
  });
}

function normalizedCapabilities(values: string[]): RoutingChannelCapability[] | undefined {
  const allowed = new Set<string>(ROUTING_CHANNEL_CAPABILITIES);
  const capabilities: RoutingChannelCapability[] = [];
  for (const rawValue of normalizedTextArray(values)) {
    const value = rawValue.toLowerCase();
    if (!allowed.has(value)) {
      throw new Error(`Unsupported routing channel capability: ${value}`);
    }
    capabilities.push(value as RoutingChannelCapability);
  }
  return capabilities.length > 0 ? capabilities : undefined;
}

function optionalText(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function requiredInteger(value: number | string | null | undefined, key: string, min: number, max: number): number {
  const parsed = parseInteger(value, key);
  if (parsed === undefined) {
    throw new Error(`${key} must be a positive integer`);
  }
  if (parsed < min || parsed > max) {
    throw new Error(`${key} must be between ${min} and ${max}`);
  }
  return parsed;
}

function optionalInteger(value: number | string | null | undefined, key: string, min: number, max: number): number | undefined {
  const parsed = parseInteger(value, key);
  if (parsed === undefined) {
    return undefined;
  }
  if (parsed < min || parsed > max) {
    throw new Error(`${key} must be between ${min} and ${max}`);
  }
  return parsed;
}

function nullableInteger(value: number | string | null | undefined, key: string, min: number, max: number): number | null | undefined {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'string' && !value.trim()) {
    return null;
  }
  return optionalInteger(value, key, min, max);
}

function parseInteger(value: number | string | null | undefined, key: string): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      throw new Error(`${key} must be an integer`);
    }
    return value;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  if (!/^-?\d+$/.test(trimmed)) {
    throw new Error(`${key} must be an integer`);
  }
  return Number.parseInt(trimmed, 10);
}

function normalizeRetryPolicy(values: RoutingChannelFormValues, allowClear: boolean): RoutingChannelMutationInput['retryPolicy'] | RoutingChannelUpdateInput['retryPolicy'] {
  if (!values.retryEnabled) {
    return allowClear ? null : undefined;
  }
  const maxAttempts = requiredInteger(values.retryMaxAttempts ?? 3, 'retryPolicy.maxAttempts', 1, 5);
  const retryableStatusCodes = normalizeRetryableStatusCodes(values.retryableStatusCodes);
  if (maxAttempts > 1 && retryableStatusCodes.length === 0) {
    throw new Error('retryPolicy.retryableStatusCodes is required when maxAttempts is greater than 1');
  }
  const backoffMs = optionalInteger(values.retryBackoffMs ?? 0, 'retryPolicy.backoffMs', 0, 2000) ?? 0;
  return {
    maxAttempts,
    retryableStatusCodes,
    backoffMs,
  };
}

function normalizeRetryableStatusCodes(value: string[] | string | null | undefined): RetryableStatusCode[] {
  const rawValues = Array.isArray(value) ? value : String(value ?? '').split(',');
  const allowed = new Set<number>(RETRYABLE_STATUS_CODES);
  const normalized: RetryableStatusCode[] = [];
  for (const raw of rawValues) {
    const text = raw.trim();
    if (!text) {
      continue;
    }
    if (!/^\d+$/.test(text)) {
      throw new Error('retryPolicy.retryableStatusCodes must contain integer HTTP statuses');
    }
    const status = Number.parseInt(text, 10);
    if (!allowed.has(status)) {
      throw new Error(`retryPolicy.retryableStatusCodes contains unsupported status: ${status}`);
    }
    if (!normalized.includes(status as RetryableStatusCode)) {
      normalized.push(status as RetryableStatusCode);
    }
  }
  return normalized;
}

function routingChannelStatus(value: string): ChannelStatus {
  const status = value.trim().toLowerCase();
  if (status === 'active' || status === 'disabled' || status === 'error') {
    return status;
  }
  throw new Error(status ? `Unsupported routing channel status: ${status}` : 'Routing channel status is required');
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
