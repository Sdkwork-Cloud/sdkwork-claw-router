import type {
  ChannelCreateInput,
  ChannelUpdateInput,
  ProviderSecretInput,
  ProviderSecretUpdateInput,
} from './channelService';

export type ChannelFormValues = {
  name: string;
  vendor: string;
  protocol: string;
  accessType: string;
  baseUrl: string;
  apiKey?: string;
  secretRef?: string;
  capabilities: string[];
  models: string[];
  circuitBreakerEnabled?: boolean;
  circuitBreakerFailureThreshold?: number | string | null;
  weight: number;
  status: string;
};

export type ProviderSecretFormValues = {
  providerCode: string;
  name: string;
  authType: string;
  secretRef: string;
  status: string;
};

const CHANNEL_CAPABILITIES = ['llm', 'image', 'audio', 'music', 'sfx', 'video'] as const;

type ChannelCapability = (typeof CHANNEL_CAPABILITIES)[number];
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
  wireValue?: string;
  aliases?: readonly string[];
};

export function resolveChannelSelectFormValue(
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

export function resolveChannelSelectSubmitValue(
  value: string,
  options: readonly SelectOption[],
  fieldName: string,
): string {
  const normalized = requiredText(value, fieldName);
  return findOptionByWireValue(normalized, options)?.id ?? normalized;
}

export function resolveAuthTypeFormValue(value: string | undefined, authTypes: readonly AuthTypeOption[]): string {
  const normalized = optionalText(value ?? '');
  if (!normalized) {
    return 'api-key';
  }
  const lowerValue = normalized.toLowerCase();
  return authTypes.find((type) => {
    const aliases = type.aliases ?? [];
    return type.id === lowerValue
      || type.title.toLowerCase() === lowerValue
      || type.wireValue?.toLowerCase() === lowerValue
      || aliases.some((alias) => alias.toLowerCase() === lowerValue);
  })?.id ?? normalized;
}

export function resolveAuthTypeSubmitValue(value: string, authTypes: readonly AuthTypeOption[]): string {
  const normalized = requiredText(value, 'authType');
  const option = authTypes.find((type) => type.id === normalized);
  return option?.wireValue ?? option?.title ?? normalized;
}

export function createChannelInputFromForm(values: ChannelFormValues): ChannelCreateInput {
  const weight = positiveInteger(values.weight, 'weight');
  return omitUndefined({
    name: values.name.trim(),
    vendor: values.vendor.trim(),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    apiKey: optionalText(values.apiKey),
    secretRef: optionalText(values.secretRef),
    capabilities: normalizedCapabilities(values.capabilities),
    models: normalizedTextArray(values.models),
    circuitBreakerPolicy: normalizeCircuitBreakerPolicy(values, false),
    weight,
    status: channelStatus(values.status),
  });
}

export function createChannelUpdateInputFromForm(values: ChannelFormValues): ChannelUpdateInput {
  const weight = positiveInteger(values.weight, 'weight');
  return omitUndefined({
    name: optionalText(values.name),
    vendor: optionalText(values.vendor),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    apiKey: optionalText(values.apiKey),
    secretRef: optionalText(values.secretRef),
    capabilities: normalizedCapabilities(values.capabilities),
    models: normalizedTextArray(values.models),
    circuitBreakerPolicy: 'circuitBreakerEnabled' in values
      ? normalizeCircuitBreakerPolicy(values, true)
      : undefined,
    weight,
    status: channelStatus(values.status),
  });
}

export function createChannelStatusUpdateInput(status: string): ChannelUpdateInput {
  return { status: channelStatus(status) };
}

export function createProviderSecretInputFromForm(values: ProviderSecretFormValues): ProviderSecretInput {
  return omitUndefined({
    providerCode: values.providerCode.trim(),
    name: values.name.trim(),
    authType: optionalText(values.authType) ?? 'api-key',
    secretRef: values.secretRef.trim(),
    status: providerSecretStatus(values.status),
  });
}

export function createProviderSecretUpdateInputFromForm(values: ProviderSecretFormValues): ProviderSecretUpdateInput {
  return omitUndefined({
    providerCode: optionalText(values.providerCode),
    name: optionalText(values.name),
    authType: optionalText(values.authType),
    secretRef: optionalText(values.secretRef),
    status: providerSecretStatus(values.status),
  });
}

export function createProviderSecretStatusUpdateInput(status: string): ProviderSecretUpdateInput {
  return { status: providerSecretStatus(status) };
}

function normalizedTextArray(values: string[]): string[] {
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

function normalizedCapabilities(values: string[]): ChannelCapability[] | undefined {
  const allowed = new Set<string>(CHANNEL_CAPABILITIES);
  const normalized: ChannelCapability[] = [];
  for (const rawValue of normalizedTextArray(values)) {
    const value = rawValue.toLowerCase();
    if (!allowed.has(value)) {
      throw new Error(`Unsupported channel capability: ${value}`);
    }
    normalized.push(value as ChannelCapability);
  }
  return normalized.length > 0 ? normalized : undefined;
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

function positiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function optionalBoundedInteger(
  value: number | string | null | undefined,
  fieldName: string,
  min: number,
  max: number,
): number | undefined {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value.trim())
      : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return parsed;
}

function normalizeCircuitBreakerPolicy(
  values: ChannelFormValues,
  allowClear: boolean,
): ChannelCreateInput['circuitBreakerPolicy'] | ChannelUpdateInput['circuitBreakerPolicy'] {
  if (!values.circuitBreakerEnabled) {
    return allowClear ? null : undefined;
  }
  const failureThreshold = optionalBoundedInteger(
    values.circuitBreakerFailureThreshold ?? 3,
    'circuitBreakerPolicy.failureThreshold',
    1,
    100,
  );
  if (failureThreshold === undefined) {
    throw new Error('circuitBreakerPolicy.failureThreshold must be between 1 and 100');
  }
  return { failureThreshold };
}

function channelStatus(value: string): NonNullable<ChannelCreateInput['status']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled' || normalized === 'error') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported channel status: ${normalized}` : 'Channel status is required');
}

function providerSecretStatus(value: string): NonNullable<ProviderSecretInput['status']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled') {
    return normalized;
  }
  throw new Error(normalized ? `Unsupported provider credential status: ${normalized}` : 'Provider credential status is required');
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
