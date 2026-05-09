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
  secretRef: string;
  capabilities: string[];
  models: string[];
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

const DEFAULT_WEIGHT = 100;
const CHANNEL_CAPABILITIES = ['llm', 'image', 'audio', 'music', 'sfx', 'video'] as const;

type ChannelCapability = (typeof CHANNEL_CAPABILITIES)[number];

export function createChannelInputFromForm(values: ChannelFormValues): ChannelCreateInput {
  return omitUndefined({
    name: values.name.trim(),
    vendor: values.vendor.trim(),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    secretRef: values.secretRef.trim(),
    capabilities: normalizedCapabilities(values.capabilities),
    models: normalizedTextArray(values.models),
    weight: positiveInteger(values.weight, DEFAULT_WEIGHT),
    status: channelStatus(values.status),
  });
}

export function createChannelUpdateInputFromForm(values: ChannelFormValues): ChannelUpdateInput {
  return omitUndefined({
    name: optionalText(values.name),
    vendor: optionalText(values.vendor),
    protocol: optionalText(values.protocol),
    accessType: optionalText(values.accessType),
    baseUrl: optionalText(values.baseUrl),
    secretRef: optionalText(values.secretRef),
    capabilities: normalizedCapabilities(values.capabilities),
    models: normalizedTextArray(values.models),
    weight: positiveInteger(values.weight, DEFAULT_WEIGHT),
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

function normalizedCapabilities(values: string[]): ChannelCapability[] | undefined {
  const allowed = new Set<string>(CHANNEL_CAPABILITIES);
  const normalized = normalizedTextArray(values)
    .map((value) => value.toLowerCase())
    .filter((value): value is ChannelCapability => allowed.has(value));
  return normalized.length > 0 ? normalized : undefined;
}

function optionalText(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function positiveInteger(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}

function channelStatus(value: string): NonNullable<ChannelCreateInput['status']> {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'active' || normalized === 'disabled' || normalized === 'error') {
    return normalized;
  }
  return 'active';
}

function providerSecretStatus(value: string): NonNullable<ProviderSecretInput['status']> {
  return value.trim().toLowerCase() === 'disabled' ? 'disabled' : 'active';
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
