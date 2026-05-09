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
  weight: number;
  status: string;
};

const DEFAULT_MODEL = 'default-model';
const DEFAULT_WEIGHT = 1;
const ROUTING_CHANNEL_CAPABILITIES = ['llm', 'image', 'audio', 'music', 'sfx', 'video'] as const;

type RoutingChannelCapability = (typeof ROUTING_CHANNEL_CAPABILITIES)[number];

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
    weight: positiveInteger(values.weight, DEFAULT_WEIGHT),
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
    weight: positiveInteger(values.weight, DEFAULT_WEIGHT),
    status: routingChannelStatus(values.status),
  });
}

function normalizedModels(values: string[]): string[] {
  const models = normalizedTextArray(values);
  return models.length > 0 ? models : [DEFAULT_MODEL];
}

function normalizedTextArray(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function normalizedCapabilities(values: string[]): RoutingChannelCapability[] | undefined {
  const allowed = new Set<string>(ROUTING_CHANNEL_CAPABILITIES);
  const capabilities = normalizedTextArray(values)
    .map((value) => value.toLowerCase())
    .filter((value): value is RoutingChannelCapability => allowed.has(value));
  return capabilities.length > 0 ? capabilities : undefined;
}

function optionalText(value: string): string | undefined {
  const normalized = value.trim();
  return normalized ? normalized : undefined;
}

function positiveInteger(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.round(value) : fallback;
}

function routingChannelStatus(value: string): ChannelStatus {
  const status = value.trim().toLowerCase();
  if (status === 'disabled' || status === 'error') {
    return status;
  }
  return 'active';
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
