import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export type ProviderFamily = 'claude' | 'codex' | 'gemini' | 'opencode';
export type IntegrationProviderType =
  | 'model_vendor_direct'
  | 'cloud_platform'
  | 'relay_aggregator'
  | 'self_hosted_gateway'
  | 'local_runtime'
  | 'custom'
  | 'unknown';

export interface ProviderConfig {
  id: string;
  providerFamily: ProviderFamily;
  integrationType: IntegrationProviderType;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'inactive';
}

export class ProviderService {
  static async fetchProviders(): Promise<ProviderConfig[]> {
    const result = await getClawRouterAppSdkClient().ai.providers.list();
    ensurePlusApiSuccess(result, 'Failed to fetch providers');
    return readRequiredApiItems(result, 'Failed to fetch providers')
      .map(normalizeProviderConfig);
  }
}

function normalizeProviderConfig(value: unknown): ProviderConfig {
  const item = readRequiredRecord(value, 'Provider record is required');
  const providerFamily = readProviderFamily(item);
  return {
    id: readRequiredString(item, 'id', 'Provider id is required'),
    providerFamily,
    integrationType: readIntegrationProviderType(item),
    name: readString(item, 'name'),
    description: readString(item, 'description'),
    url: readString(item, 'url'),
    status: readString(item, 'status') === 'inactive' ? 'inactive' : 'active',
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readProviderFamily(item: ApiRecord): ProviderFamily {
  const type = readString(item, 'providerFamily').toLowerCase();
  if (type === 'claude' || type === 'codex' || type === 'gemini' || type === 'opencode') {
    return type;
  }
  throw new Error(type ? `Unsupported provider family: ${type}` : 'Provider family is required');
}

function readIntegrationProviderType(item: ApiRecord): IntegrationProviderType {
  const integrationType = readString(item, 'integrationType').toLowerCase();
  if (
    integrationType === 'model_vendor_direct'
    || integrationType === 'cloud_platform'
    || integrationType === 'relay_aggregator'
    || integrationType === 'self_hosted_gateway'
    || integrationType === 'local_runtime'
    || integrationType === 'custom'
    || integrationType === 'unknown'
  ) {
    return integrationType;
  }
  throw new Error(
    integrationType
      ? `Unsupported integration provider type: ${integrationType}`
      : 'Integration provider type is required',
  );
}
