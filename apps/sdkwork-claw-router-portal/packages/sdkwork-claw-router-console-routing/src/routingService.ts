import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readRequiredApiItem,
  readApiRecord,
  readBoolean,
  readNumber,
  readRequiredNumber,
  readRequiredApiItems,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  readStringArray,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { Channel } from './types';
import type { ChannelStatus } from './types';
import type { CreateRoutingChannelRequest, UpdateRoutingChannelRequest } from '@sdkwork/clawrouter-app-sdk';

export interface RequestTrace {
  id: string;
  time: string;
  model: string;
  channel: string;
  status: number;
  duration: string;
  tokens: number;
}

export interface RoutingUsageData {
  time: string;
  requests: number;
  latency: number;
}

export interface RoutingModelStats {
  m: string;
  req: string;
  sr: string;
  tok: string;
  lat: string;
}

export type StrategyType = 'latency' | 'weighted' | 'cost';

export interface MappingRule {
  id: string;
  sourceModel: string;
  targetModel: string;
}

export interface RoutingStrategySnapshot {
  strategy: StrategyType;
  mappingRules: MappingRule[];
}

export type RoutingApiKeyStatus = 'enabled' | 'disabled';

export interface RoutingApiKey {
  id: string;
  name: string;
  key: string;
  status: RoutingApiKeyStatus;
  totalUsage: string;
  createdAt: string;
}

type RoutingChannelCapability = 'llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video';

export type RoutingChannelMutationInput = {
  name: string;
  vendor: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string;
  secretRef: string;
  models: string[];
  capabilities?: string[];
  weight?: number;
  status?: ChannelStatus;
};

export type RoutingChannelUpdateInput = {
  name?: string;
  vendor?: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string | null;
  secretRef?: string;
  models?: string[];
  capabilities?: string[];
  weight?: number;
  status?: ChannelStatus;
};

export interface RoutingChannelTestResult {
  channelId: string;
  success: boolean;
  status: ChannelStatus;
  latency: string;
  item: Channel;
}

export const protocolsList = [
  { id: 'OpenAI', label: 'OpenAI 兼容协议' },
  { id: 'Anthropic', label: 'Anthropic 协议' },
  { id: 'Gemini', label: 'Gemini 协议' },
  { id: 'Ollama', label: 'Ollama 原生接口' },
  { id: 'Custom', label: '平台独有 / 自定义协议' },
];

export const authTypesList = [
  { id: 'api-key', title: '标准 API Key', desc: 'Bearer Token 鉴权 (默认)', isSpecial: false },
  { id: 'oauth-gcp', title: 'GCP Vertex OAuth', desc: 'OAuth 2.0 / Service Account', isSpecial: true },
  { id: 'aws-bedrock', title: 'AWS Bedrock', desc: 'AWS SigV4', isSpecial: true },
  { id: 'azure-ad', title: 'Azure OpenAI', desc: 'Azure AD', isSpecial: true },
  { id: 'claude-code', title: 'Claude Code', desc: 'Setup Token', isSpecial: true },
];

export const knownModelVendors = [
  { id: 'Anthropic', name: 'Anthropic' },
  { id: 'OpenAI', name: 'OpenAI' },
  { id: 'Gemini', name: 'Google (Gemini)' },
  { id: 'Meta', name: 'Meta (Llama)' },
  { id: 'Ollama', name: 'Ollama' },
  { id: 'OpenRouter', name: 'OpenRouter' },
  { id: 'DeepSeek', name: 'DeepSeek' },
  { id: 'Zhipu', name: '智谱 (Zhipu)' },
  { id: 'Mistral', name: 'Mistral AI' },
  { id: 'Cohere', name: 'Cohere' },
  { id: 'Custom', name: '未知 / 其他' },
];

export const prefillModels: Record<string, string[]> = {
  Anthropic: ['claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
  OpenAI: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini', 'gpt-4-turbo'],
  Gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
  DeepSeek: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
  Zhipu: ['glm-4-plus', 'glm-4-air', 'glm-4-flash', 'glm-4v', 'cogview-3'],
  Ollama: ['llama3:8b', 'llama3:70b', 'phi3', 'mistral', 'qwen2'],
  OpenRouter: ['openrouter/auto', 'anthropic/claude-3-opus', 'google/gemini-1.5-pro'],
  Mistral: ['mistral-large-latest', 'pixtral-large-2411'],
  Meta: ['llama-3.3-70b-versatile'],
  Custom: ['default-custom-model'],
};

export class RoutingService {
  static async fetchRequestTraces(): Promise<RequestTrace[]> {
    const result = await getClawRouterAppSdkClient().router.fetchRequestTraces();
    ensurePlusApiSuccess(result, 'Failed to fetch request traces');
    return readRequiredApiItems(result, 'Failed to fetch request traces')
      .map(normalizeRequestTrace);
  }

  static async fetchUsageData(): Promise<{ chartData: RoutingUsageData[]; modelStats: RoutingModelStats[] }> {
    const result = await getClawRouterAppSdkClient().router.fetchUsageData();
    ensurePlusApiSuccess(result, 'Failed to fetch routing usage data');
    const data = readApiRecord(result);
    return {
      chartData: readRequiredApiItems(data, 'Failed to fetch routing usage data', ['chartData'])
        .map(normalizeRoutingUsageData),
      modelStats: readRequiredApiItems(data, 'Failed to fetch routing usage data', ['modelStats'])
        .map(normalizeRoutingModelStats),
    };
  }

  static async fetchChannels(): Promise<Channel[]> {
    const result = await getClawRouterAppSdkClient().router.fetchChannels();
    ensurePlusApiSuccess(result, 'Failed to fetch routing channels');
    return readRequiredApiItems(result, 'Failed to fetch routing channels')
      .map(normalizeRoutingChannel);
  }

  static async createChannel(input: RoutingChannelMutationInput): Promise<Channel> {
    const router = getClawRouterAppSdkClient().router;
    const result = await router.createChannel(toCreateRoutingChannelRequest(input));
    ensurePlusApiSuccess(result, 'Failed to create routing channel');
    return normalizeRoutingChannel(readRequiredApiItem(result, 'Created routing channel is missing'));
  }

  static async updateChannel(channelId: string, input: RoutingChannelUpdateInput): Promise<Channel> {
    const router = getClawRouterAppSdkClient().router;
    const result = await router.updateChannel(
      requiredSafePathSegment(channelId, 'channelId'),
      toUpdateRoutingChannelRequest(input),
    );
    ensurePlusApiSuccess(result, 'Failed to update routing channel');
    return normalizeRoutingChannel(readRequiredApiItem(result, 'Updated routing channel is missing'));
  }

  static async deleteChannel(channelId: string): Promise<boolean> {
    const router = getClawRouterAppSdkClient().router;
    const result = await router.deleteChannel(requiredSafePathSegment(channelId, 'channelId'));
    ensurePlusApiSuccess(result, 'Failed to delete routing channel');
    return readBoolean(readApiRecord(result), 'deleted');
  }

  static async setChannelStatus(channelId: string, status: ChannelStatus): Promise<Channel> {
    const router = getClawRouterAppSdkClient().router;
    const normalizedStatus = status === 'disabled' ? 'disabled' : 'active';
    const result = await router.setChannelStatus(
      requiredSafePathSegment(channelId, 'channelId'),
      { status: normalizedStatus },
    );
    ensurePlusApiSuccess(result, 'Failed to update routing channel status');
    return normalizeRoutingChannel(readRequiredApiItem(result, 'Updated routing channel is missing'));
  }

  static async testChannel(channelId: string): Promise<RoutingChannelTestResult> {
    const router = getClawRouterAppSdkClient().router;
    const normalizedChannelId = requiredSafePathSegment(channelId, 'channelId');
    const result = await router.testChannel(normalizedChannelId);
    ensurePlusApiSuccess(result, 'Failed to test routing channel');
    const data = readApiRecord(result);
    return {
      channelId: readString(data, 'channelId', normalizedChannelId),
      success: readBoolean(data, 'success'),
      status: readChannelStatus(readString(data, 'status', 'active')),
      latency: readString(data, 'latency'),
      item: normalizeRoutingChannel(readRequiredApiItem(result, 'Routing channel test response is missing channel data', ['item'])),
    };
  }

  static async fetchApiKeys(): Promise<RoutingApiKey[]> {
    const result = await getClawRouterAppSdkClient().router.fetchApiKeys();
    ensurePlusApiSuccess(result, 'Failed to fetch routing API keys');
    return readRequiredApiItems(result, 'Failed to fetch routing API keys')
      .map(normalizeRoutingApiKey);
  }

  static async fetchStrategy(): Promise<RoutingStrategySnapshot> {
    const result = await getClawRouterAppSdkClient().router.fetchStrategy();
    ensurePlusApiSuccess(result, 'Failed to fetch routing strategy');
    return normalizeRoutingStrategySnapshot(readApiRecord(result));
  }

  static async updateStrategy(snapshot: RoutingStrategySnapshot): Promise<void> {
    const request = {
      strategy: snapshot.strategy,
      mappingRules: snapshot.mappingRules.map(toUpdateMappingRuleRequest),
    };
    const result = await getClawRouterAppSdkClient().router.updateStrategy(request);
    ensurePlusApiSuccess(result, 'Failed to update routing strategy');
  }
}

function toCreateRoutingChannelRequest(input: RoutingChannelMutationInput): CreateRoutingChannelRequest {
  const secretRef = normalizeSecretRef(input.secretRef);
  if (!isSecretRef(secretRef)) {
    throw new Error('secretRef must use vault:// or secret://');
  }
  return {
    name: requiredText(input.name, 'name'),
    vendor: requiredText(input.vendor, 'vendor'),
    protocol: normalizeOptionalText(input.protocol),
    accessType: normalizeOptionalText(input.accessType),
    baseUrl: normalizeOptionalText(input.baseUrl),
    secretRef,
    models: requiredStringList(input.models, 'models'),
    capabilities: normalizeCapabilities(input.capabilities),
    weight: optionalPositiveInteger(input.weight, 'weight'),
    status: input.status,
  };
}

function toUpdateRoutingChannelRequest(input: RoutingChannelUpdateInput): UpdateRoutingChannelRequest {
  const request: UpdateRoutingChannelRequest = {};
  const name = normalizeOptionalText(input.name);
  if (name !== undefined) request.name = name;
  const vendor = normalizeOptionalText(input.vendor);
  if (vendor !== undefined) request.vendor = vendor;
  const protocol = normalizeOptionalText(input.protocol);
  if (protocol !== undefined) request.protocol = protocol;
  const accessType = normalizeOptionalText(input.accessType);
  if (accessType !== undefined) request.accessType = accessType;
  if (input.baseUrl !== undefined) request.baseUrl = normalizeOptionalText(input.baseUrl) ?? null;
  if (input.secretRef !== undefined) {
    const secretRef = normalizeSecretRef(input.secretRef);
    if (!isSecretRef(secretRef)) {
      throw new Error('secretRef must use vault:// or secret://');
    }
    request.secretRef = secretRef;
  }
  if (input.models !== undefined) request.models = requiredStringList(input.models, 'models');
  if (input.capabilities !== undefined) request.capabilities = normalizeCapabilities(input.capabilities);
  if (input.weight !== undefined) request.weight = optionalPositiveInteger(input.weight, 'weight');
  if (input.status !== undefined) request.status = input.status;
  return request;
}

function readChannelStatus(value: string): ChannelStatus {
  const status = value.trim().toLowerCase();
  if (status === 'disabled') {
    return 'disabled';
  }
  if (status === 'error') {
    return 'error';
  }
  return 'active';
}

function isSecretRef(value: string): boolean {
  return /^(vault|secret):\/\/\S+$/.test(value);
}

function normalizeSecretRef(value: string): string {
  return value.trim();
}

function normalizeOptionalText(value: string | null | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeStringList(values: string[] | undefined): string[] {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}

function requiredStringList(values: string[] | undefined, fieldName: string): string[] {
  const normalized = normalizeStringList(values);
  if (normalized.length === 0) {
    throw new Error(`${fieldName} must include at least one item`);
  }
  return normalized;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalPositiveInteger(value: number | undefined, fieldName: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return Math.round(value);
}

function normalizeCapabilities(values: string[] | undefined): RoutingChannelCapability[] | undefined {
  const allowed = new Set<RoutingChannelCapability>(['llm', 'image', 'audio', 'music', 'sfx', 'video']);
  const capabilities = normalizeStringList(values).filter((value): value is RoutingChannelCapability =>
    allowed.has(value as RoutingChannelCapability),
  );
  return capabilities.length > 0 ? capabilities : undefined;
}

function normalizeRequestTrace(value: unknown): RequestTrace {
  const item = readRequiredRecord(value, 'Request trace record is required');
  return {
    id: readRequiredString(item, 'id', 'Request trace id is required'),
    time: readRequiredString(item, 'time', 'Request trace time is required'),
    model: readRequiredString(item, 'model', 'Request trace model is required'),
    channel: readRequiredString(item, 'channel', 'Request trace channel is required'),
    status: readRequiredNumber(item, 'status', 'Request trace status is required'),
    duration: readRequiredString(item, 'duration', 'Request trace duration is required'),
    tokens: readRequiredNonNegativeMetric(item, 'tokens', 'Request trace tokens are required'),
  };
}

function normalizeRoutingUsageData(value: unknown): RoutingUsageData {
  const item = readRequiredRecord(value, 'Routing usage data record is required');
  return {
    time: readRequiredString(item, 'time', 'Routing usage time is required'),
    requests: readRequiredNonNegativeMetric(item, 'requests', 'Routing usage requests are required'),
    latency: readRequiredNonNegativeMetric(item, 'latency', 'Routing usage latency is required'),
  };
}

function normalizeRoutingModelStats(value: unknown): RoutingModelStats {
  const item = readRequiredRecord(value, 'Routing model stats record is required');
  return {
    m: readRequiredString(item, 'm', 'Routing model stats model is required'),
    req: readRequiredString(item, 'req', 'Routing model stats request count is required'),
    sr: readRequiredString(item, 'sr', 'Routing model stats success rate is required'),
    tok: readRequiredString(item, 'tok', 'Routing model stats tokens are required'),
    lat: readRequiredString(item, 'lat', 'Routing model stats latency is required'),
  };
}

function normalizeRoutingChannel(value: unknown): Channel {
  const item = readRequiredRecord(value, 'Routing channel record is required');
  const vendor = readRequiredFirstString(item, ['vendor', 'provider', 'providerCode', 'provider_code'], 'Routing channel vendor is required');
  const providerCode = readFirstString(item, ['providerCode', 'provider_code'], vendor);
  const capabilities = readRequiredFirstStringArray(item, ['capabilities', 'modalities'], 'Routing channel capabilities are required');
  const errors = readNumber(item, 'errors', readNumber(item, 'consecutiveErrorCount'));

  return {
    id: readRequiredAnyString(item, ['id', 'uuid', 'channelCode', 'channel_code'], 'Routing channel id is required'),
    name: readRequiredFirstString(item, ['name', 'channelName', 'channel_name'], 'Routing channel name is required'),
    vendor,
    provider: readFirstString(item, ['provider', 'providerName', 'provider_name'], vendor),
    providerCode,
    protocol: readFirstString(item, ['protocol'], vendor),
    accessType: readFirstString(item, ['accessType', 'access_type'], 'api-key'),
    baseUrl: readFirstString(item, ['baseUrl', 'base_url', 'baseUrlOverride', 'base_url_override']),
    apiKey: readRequiredFirstString(item, ['apiKey', 'secretRef', 'secret_ref', 'maskedLabel', 'masked_label'], 'Routing channel secret reference is required'),
    models: readRequiredFirstStringArray(item, ['models', 'modelList', 'model_list'], 'Routing channel models are required'),
    capabilities,
    isMultimodal: readBoolean(
      item,
      'isMultimodal',
      readBoolean(item, 'is_multimodal', capabilities.some((capability) => capability !== 'llm')),
    ),
    weight: readNumber(item, 'weight', 1),
    status: readRoutingChannelStatus(item, errors),
    latency: readFirstString(item, ['latency', 'latencyP95', 'latency_p95'], 'N/A'),
    rpm: readNumber(item, 'rpm'),
    balance: readFirstString(item, ['balance'], 'N/A'),
    errors,
  };
}

function normalizeRoutingApiKey(value: unknown): RoutingApiKey {
  const item = readRequiredRecord(value, 'Routing API key record is required');
  const id = readRequiredFirstString(item, ['id', 'uuid', 'keyPrefix', 'key_prefix'], 'Routing API key id is required');
  const key = readRequiredFirstString(
    item,
    ['key', 'keyVal', 'key_display_masked', 'keyDisplayMasked', 'key_prefix', 'keyPrefix'],
    'Routing API key value is required',
  );

  return {
    id,
    name: readFirstString(item, ['name'], id || key),
    key,
    status: readRoutingApiKeyStatus(item),
    totalUsage: readFirstString(item, ['totalUsage', 'usedQuota', 'usage_amount_total', 'capacity_used'], '0'),
    createdAt: readFirstString(item, ['createdAt', 'created', 'created_at']),
  };
}

function normalizeRoutingStrategySnapshot(item: ApiRecord): RoutingStrategySnapshot {
  return {
    strategy: readStrategyType(item),
    mappingRules: readRequiredApiItems(item, 'Routing strategy mapping rules are required', ['mappingRules'])
      .map(normalizeMappingRule),
  };
}

function normalizeMappingRule(value: unknown): MappingRule {
  const item = readRequiredRecord(value, 'Routing mapping rule record is required');
  const sourceModel = readRequiredFirstString(item, ['sourceModel', 'source_model'], 'Routing mapping rule source model is required');

  return {
    id: readRequiredFirstString(item, ['id', 'uuid', 'ruleCode', 'rule_code'], 'Routing mapping rule id is required'),
    sourceModel,
    targetModel: readRequiredFirstString(item, ['targetModel', 'target_model'], 'Routing mapping rule target model is required'),
  };
}

function toUpdateMappingRuleRequest(rule: MappingRule): Record<string, unknown> {
  return {
    id: requiredText(rule.id, 'id'),
    sourceModel: requiredText(rule.sourceModel, 'sourceModel'),
    targetModel: requiredText(rule.targetModel, 'targetModel'),
  };
}

function readRoutingChannelStatus(item: ApiRecord, errors = readNumber(item, 'errors')): Channel['status'] {
  const status = readFirstString(item, ['status', 'healthStatus', 'health_status']).trim().toLowerCase();
  if (status === 'disabled' || status === 'inactive' || status === '0') {
    return 'disabled';
  }
  if (status === 'error' || status === 'warning' || status === 'unhealthy' || status === '2' || errors > 0) {
    return 'error';
  }
  return 'active';
}

function readRoutingApiKeyStatus(item: ApiRecord): RoutingApiKeyStatus {
  const status = readFirstString(item, ['status']).trim().toLowerCase();
  if (status === 'enabled' || status === 'active' || status === 'normal' || status === '1') {
    return 'enabled';
  }
  return 'disabled';
}

function readStrategyType(item: ApiRecord): StrategyType {
  const strategy = readFirstString(item, ['strategy']).trim().toLowerCase();
  if (strategy === 'latency' || strategy === 'weighted' || strategy === 'cost') {
    return strategy;
  }
  throw new Error(strategy ? `Unsupported routing strategy: ${strategy}` : 'Routing strategy is required');
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readFirstString(item: ApiRecord, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = readString(item, key);
    if (value) {
      return value;
    }
  }
  return fallback;
}

function readRequiredFirstString(item: ApiRecord, keys: string[], message: string): string {
  const value = readFirstString(item, keys).trim();
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function readRequiredAnyString(item: ApiRecord, keys: string[], message: string): string {
  for (const key of keys) {
    try {
      return readRequiredString(item, key, message);
    } catch {
      // Continue through accepted wire aliases before failing on the canonical contract message.
    }
  }
  throw new Error(message);
}

function readRequiredNonNegativeMetric(item: ApiRecord, key: string, message: string): number {
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(message);
  }
  return value;
}

function readFirstStringArray(item: ApiRecord, keys: string[], fallback: string[] = []): string[] {
  for (const key of keys) {
    const values = readStringArray(item, key);
    if (values.length > 0) {
      return values;
    }
    const raw = readString(item, key).trim();
    if (raw) {
      const items = raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      if (items.length > 0) {
        return items;
      }
    }
  }
  return [...fallback];
}

function readRequiredFirstStringArray(item: ApiRecord, keys: string[], message: string): string[] {
  const values = readFirstStringArray(item, keys);
  if (values.length === 0) {
    throw new Error(message);
  }
  return values;
}
