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
import type { ChannelStatus, RetryableStatusCode, RoutingRetryPolicy } from './types';
import type { CreateRoutingChannelRequest, ProviderRetryPolicy, UpdateRoutingChannelRequest } from '@sdkwork/clawrouter-app-sdk';

export interface RequestTrace {
  id: string;
  time: string;
  model: string;
  channel: string;
  status: number;
  duration: string;
  tokens: number;
  traceId: string;
  requestId: string;
  requestPath: string;
  httpMethod: string;
  requestPayloadHash: string;
  responsePayloadHash: string;
  requestBytes: number;
  responseBytes: number;
  providerErrorCode: string | null;
  errorType: string | null;
  errorMessageMasked: string | null;
  startedAt: string;
  endedAt: string;
  streaming: boolean;
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
type RoutingChannelCommandStatus = 'active' | 'disabled';

export type RoutingChannelMutationInput = {
  name: string;
  vendor: string;
  protocol?: string;
  accessType?: string;
  baseUrl?: string;
  secretRef: string;
  models: string[];
  capabilities?: string[];
  timeoutMs?: number;
  retryPolicy?: RoutingRetryPolicy;
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
  timeoutMs?: number | null;
  retryPolicy?: RoutingRetryPolicy | null;
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
  { id: 'OpenAI', label: 'OpenAI compatible protocol' },
  { id: 'Anthropic', label: 'Anthropic protocol' },
  { id: 'Gemini', label: 'Gemini protocol' },
  { id: 'Ollama', label: 'Ollama native API' },
  { id: 'Custom', label: 'Platform custom protocol' },
];

export const authTypesList = [
  { id: 'api-key', title: 'API Key', desc: 'Bearer token or provider API key', isSpecial: false, aliases: ['Standard API Key'] },
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
  { id: 'Zhipu', name: '鏅鸿氨 (Zhipu)' },
  { id: 'Mistral', name: 'Mistral AI' },
  { id: 'Cohere', name: 'Cohere' },
  { id: 'Custom', name: '鏈煡 / 鍏朵粬' },
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
    const result = await getClawRouterAppSdkClient().ai.routing.requestTraces.list();
    ensurePlusApiSuccess(result, 'Failed to fetch request traces');
    return readRequiredApiItems(result, 'Failed to fetch request traces')
      .map(normalizeRequestTrace);
  }

  static async fetchUsageData(): Promise<{ chartData: RoutingUsageData[]; modelStats: RoutingModelStats[] }> {
    const result = await getClawRouterAppSdkClient().ai.routing.usage.list();
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
    const result = await getClawRouterAppSdkClient().ai.routing.channels.list();
    ensurePlusApiSuccess(result, 'Failed to fetch routing channels');
    return readRequiredApiItems(result, 'Failed to fetch routing channels')
      .map(normalizeRoutingChannel);
  }

  static async createChannel(input: RoutingChannelMutationInput): Promise<Channel> {
    const result = await getClawRouterAppSdkClient().ai.routing.channels.create(toCreateRoutingChannelRequest(input));
    ensurePlusApiSuccess(result, 'Failed to create routing channel');
    return normalizeRoutingChannel(readRequiredApiItem(result, 'Created routing channel is missing'));
  }

  static async updateChannel(channelId: string, input: RoutingChannelUpdateInput): Promise<Channel> {
    const result = await getClawRouterAppSdkClient().ai.routing.channels.update(
      requiredSafePathSegment(channelId, 'channelId'),
      toUpdateRoutingChannelRequest(input),
    );
    ensurePlusApiSuccess(result, 'Failed to update routing channel');
    return normalizeRoutingChannel(readRequiredApiItem(result, 'Updated routing channel is missing'));
  }

  static async deleteChannel(channelId: string): Promise<boolean> {
    const result = await getClawRouterAppSdkClient().ai.routing.channels.delete(requiredSafePathSegment(channelId, 'channelId'));
    ensureDeleteResult(result, 'Routing channel delete confirmation is required');
    return true;
  }

  static async setChannelStatus(channelId: string, status: RoutingChannelCommandStatus): Promise<Channel> {
    const normalizedStatus = normalizeChannelCommandStatus(status);
    const result = await getClawRouterAppSdkClient().ai.routing.channels.status.update(
      requiredSafePathSegment(channelId, 'channelId'),
      { status: normalizedStatus },
    );
    ensurePlusApiSuccess(result, 'Failed to update routing channel status');
    return normalizeRoutingChannel(readRequiredApiItem(result, 'Updated routing channel is missing'));
  }

  static async testChannel(channelId: string): Promise<RoutingChannelTestResult> {
    const normalizedChannelId = requiredSafePathSegment(channelId, 'channelId');
    const result = await getClawRouterAppSdkClient().ai.routing.channels.verify(normalizedChannelId);
    ensurePlusApiSuccess(result, 'Failed to test routing channel');
    const data = readApiRecord(result);
    return {
      channelId: readRequiredString(data, 'channelId', 'Routing channel test channel id is required'),
      success: readBoolean(data, 'success'),
      status: readChannelStatus(readRequiredString(data, 'status', 'Routing channel test status is required')),
      latency: readRequiredString(data, 'latency', 'Routing channel test latency is required'),
      item: normalizeRoutingChannel(readRequiredApiItem(result, 'Routing channel test response is missing channel data', ['item'])),
    };
  }

  static async fetchApiKeys(): Promise<RoutingApiKey[]> {
    const result = await getClawRouterAppSdkClient().ai.routing.apiKeys.list();
    ensurePlusApiSuccess(result, 'Failed to fetch routing API keys');
    return readRequiredApiItems(result, 'Failed to fetch routing API keys')
      .map(normalizeRoutingApiKey);
  }

  static async fetchStrategy(): Promise<RoutingStrategySnapshot> {
    const result = await getClawRouterAppSdkClient().ai.routing.strategy.list();
    ensurePlusApiSuccess(result, 'Failed to fetch routing strategy');
    return normalizeRoutingStrategySnapshot(readApiRecord(result));
  }

  static async updateStrategy(snapshot: RoutingStrategySnapshot): Promise<void> {
    const request = {
      strategy: snapshot.strategy,
      mappingRules: snapshot.mappingRules.map(toUpdateMappingRuleRequest),
    };
    const result = await getClawRouterAppSdkClient().ai.routing.strategy.update(request);
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
    timeoutMs: optionalBoundedInteger(input.timeoutMs, 'timeoutMs', 1, 600_000),
    retryPolicy: normalizeRetryPolicy(input.retryPolicy),
    weight: optionalPositiveInteger(input.weight, 'weight'),
    status: input.status === undefined ? undefined : normalizeChannelStatus(input.status),
  };
}

function ensureDeleteResult(result: unknown, message: string): void {
  ensurePlusApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
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
  if (input.timeoutMs !== undefined) {
    request.timeoutMs = input.timeoutMs === null ? null : optionalBoundedInteger(input.timeoutMs, 'timeoutMs', 1, 600_000);
  }
  if (input.retryPolicy !== undefined) {
    request.retryPolicy = input.retryPolicy === null ? null : normalizeRetryPolicy(input.retryPolicy);
  }
  if (input.weight !== undefined) request.weight = optionalPositiveInteger(input.weight, 'weight');
  if (input.status !== undefined) request.status = normalizeChannelStatus(input.status);
  return request;
}

function readChannelStatus(value: string): ChannelStatus {
  const status = value.trim().toLowerCase();
  return normalizeChannelStatus(status);
}

function normalizeChannelStatus(value: string): ChannelStatus {
  const status = value.trim().toLowerCase();
  if (status === 'active' || status === 'disabled' || status === 'error') {
    return status;
  }
  throw new Error(status ? `Unsupported routing channel status: ${status}` : 'Routing channel status is required');
}

function normalizeChannelCommandStatus(value: string): RoutingChannelCommandStatus {
  const status = value.trim().toLowerCase();
  if (status === 'active' || status === 'disabled') {
    return status;
  }
  throw new Error(status ? `Unsupported routing channel command status: ${status}` : 'Routing channel command status is required');
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
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function optionalBoundedInteger(value: number | undefined, fieldName: string, min: number, max: number): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return value;
}

function normalizeRetryPolicy(value: RoutingRetryPolicy | undefined): ProviderRetryPolicy | undefined {
  if (value === undefined) {
    return undefined;
  }
  const maxAttempts = optionalBoundedInteger(value.maxAttempts, 'retryPolicy.maxAttempts', 1, 5);
  if (maxAttempts === undefined) {
    throw new Error('retryPolicy.maxAttempts is required');
  }
  const retryableStatusCodes = normalizeRetryableStatusCodes(value.retryableStatusCodes);
  if (maxAttempts > 1 && retryableStatusCodes.length === 0) {
    throw new Error('retryPolicy.retryableStatusCodes is required when maxAttempts is greater than 1');
  }
  return {
    maxAttempts,
    retryableStatusCodes,
    backoffMs: optionalBoundedInteger(value.backoffMs ?? 0, 'retryPolicy.backoffMs', 0, 2000),
  };
}

function normalizeRetryableStatusCodes(values: number[]): RetryableStatusCode[] {
  const allowed = new Set<number>([408, 409, 425, 429, 500, 502, 503, 504]);
  const normalized: RetryableStatusCode[] = [];
  for (const value of values) {
    if (!Number.isInteger(value) || !allowed.has(value)) {
      throw new Error(`retryPolicy.retryableStatusCodes contains unsupported status: ${value}`);
    }
    if (!normalized.includes(value as RetryableStatusCode)) {
      normalized.push(value as RetryableStatusCode);
    }
  }
  return normalized;
}

function normalizeCapabilities(values: string[] | undefined): RoutingChannelCapability[] | undefined {
  const allowed = new Set<RoutingChannelCapability>(['llm', 'image', 'audio', 'music', 'sfx', 'video']);
  const capabilities: RoutingChannelCapability[] = [];
  for (const rawValue of normalizeStringList(values)) {
    const value = rawValue.toLowerCase();
    if (!allowed.has(value as RoutingChannelCapability)) {
      throw new Error(`Unsupported routing channel capability: ${value}`);
    }
    capabilities.push(value as RoutingChannelCapability);
  }
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
    traceId: readRequiredString(item, 'traceId', 'Request trace trace id is required'),
    requestId: readRequiredString(item, 'requestId', 'Request trace request id is required'),
    requestPath: readRequiredString(item, 'requestPath', 'Request trace request path is required'),
    httpMethod: readRequiredString(item, 'httpMethod', 'Request trace HTTP method is required'),
    requestPayloadHash: readRequiredString(item, 'requestPayloadHash', 'Request trace request payload hash is required'),
    responsePayloadHash: readRequiredString(item, 'responsePayloadHash', 'Request trace response payload hash is required'),
    requestBytes: readRequiredNonNegativeMetric(item, 'requestBytes', 'Request trace request bytes are required'),
    responseBytes: readRequiredNonNegativeMetric(item, 'responseBytes', 'Request trace response bytes are required'),
    providerErrorCode: nullableString(item, 'providerErrorCode'),
    errorType: nullableString(item, 'errorType'),
    errorMessageMasked: nullableString(item, 'errorMessageMasked'),
    startedAt: readRequiredString(item, 'startedAt', 'Request trace started time is required'),
    endedAt: readRequiredString(item, 'endedAt', 'Request trace ended time is required'),
    streaming: readRequiredBoolean(item, 'streaming', 'Request trace streaming flag is required'),
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
  const id = readRequiredAnyString(item, ['id', 'uuid', 'channelCode', 'channel_code'], 'Routing channel id is required');
  const vendor = readRequiredFirstString(item, ['vendor', 'provider', 'providerCode', 'provider_code'], 'Routing channel vendor is required');
  const providerCode = readRequiredFirstString(item, ['providerCode', 'provider_code'], 'Routing channel provider code is required');
  const capabilities = readRequiredFirstStringArray(item, ['capabilities', 'modalities'], 'Routing channel capabilities are required');
  const errors = readRequiredNonNegativeMetric(item, 'errors', 'Routing channel errors are required');
  const retryPolicy = readRoutingRetryPolicy(item, 'retryPolicy');

  return {
    id,
    name: readRequiredFirstString(item, ['name', 'channelName', 'channel_name'], 'Routing channel name is required'),
    vendor,
    provider: readRequiredFirstString(item, ['provider', 'providerName', 'provider_name'], 'Routing channel provider is required'),
    providerCode,
    protocol: readRequiredFirstString(item, ['protocol'], 'Routing channel protocol is required'),
    accessType: readRequiredFirstString(item, ['accessType', 'access_type'], 'Routing channel access type is required'),
    baseUrl: readRequiredFirstString(item, ['baseUrl', 'base_url', 'baseUrlOverride', 'base_url_override'], 'Routing channel base URL is required'),
    apiKey: readRequiredFirstString(item, ['apiKey', 'secretRef', 'secret_ref', 'maskedLabel', 'masked_label'], 'Routing channel secret reference is required'),
    models: readRequiredFirstStringArray(item, ['models', 'modelList', 'model_list'], 'Routing channel models are required'),
    capabilities,
    isMultimodal: readRequiredFirstBoolean(item, ['isMultimodal', 'is_multimodal'], 'Routing channel multimodal flag is required'),
    timeoutMs: readOptionalBoundedMetric(item, 'timeoutMs', 1, 600_000),
    retryPolicy,
    weight: readRequiredPositiveInteger(item, 'weight', 'Routing channel weight is required'),
    status: readRoutingChannelStatus(item, errors),
    latency: readRequiredFirstString(item, ['latency', 'latencyP95', 'latency_p95'], 'Routing channel latency is required'),
    rpm: readRequiredNonNegativeMetric(item, 'rpm', 'Routing channel rpm is required'),
    balance: readRequiredFirstString(item, ['balance'], 'Routing channel balance is required'),
    errors,
  };
}

function readRoutingRetryPolicy(item: ApiRecord, key: string): RoutingRetryPolicy | undefined {
  const value = item[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!isRecord(value)) {
    throw new Error('Routing channel retryPolicy must be an object');
  }
  const maxAttempts = readRequiredNonNegativeMetric(value, 'maxAttempts', 'Routing channel retryPolicy.maxAttempts is required');
  if (maxAttempts < 1 || maxAttempts > 5) {
    throw new Error('Routing channel retryPolicy.maxAttempts must be between 1 and 5');
  }
  const retryableStatusCodes = readRetryableStatusCodes(value, 'retryableStatusCodes');
  const backoffMs = readOptionalNonNegativeMetric(value, 'backoffMs');
  if (backoffMs > 2000) {
    throw new Error('Routing channel retryPolicy.backoffMs must be between 0 and 2000');
  }
  return {
    maxAttempts,
    retryableStatusCodes,
    backoffMs,
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
  const status = readRequiredFirstString(item, ['status', 'healthStatus', 'health_status'], 'Routing channel status is required')
    .trim()
    .toLowerCase();
  if (status === 'disabled') {
    return 'disabled';
  }
  if (status === 'error' || errors > 0) {
    return 'error';
  }
  if (status === 'active') {
    return 'active';
  }
  throw new Error(`Unsupported routing channel status: ${status}`);
}

function readRoutingApiKeyStatus(item: ApiRecord): RoutingApiKeyStatus {
  const status = readRequiredFirstString(item, ['status'], 'Routing API key status is required').trim().toLowerCase();
  if (status === 'enabled' || status === 'active' || status === 'normal' || status === '1') {
    return 'enabled';
  }
  if (status === 'disabled' || status === 'inactive' || status === 'banned' || status === '0') {
    return 'disabled';
  }
  throw new Error(`Unsupported routing API key status: ${status}`);
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

function readRequiredFirstBoolean(item: ApiRecord, keys: string[], message: string): boolean {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'boolean') {
      return value;
    }
    if (value !== undefined && value !== null && value !== '') {
      throw new Error(message);
    }
  }
  throw new Error(message);
}

function readRequiredBoolean(item: ApiRecord, key: string, message: string): boolean {
  const value = item[key];
  if (typeof value !== 'boolean') {
    throw new Error(message);
  }
  return value;
}

function readRequiredNonNegativeMetric(item: ApiRecord, key: string, message: string): number {
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(message);
  }
  return value;
}

function readRequiredPositiveInteger(item: ApiRecord, key: string, message: string): number {
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 1) {
    throw new Error(message);
  }
  return value;
}

function readOptionalNonNegativeMetric(item: ApiRecord, key: string): number {
  const value = readNumber(item, key, 0);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }
  return value;
}

function readOptionalBoundedMetric(item: ApiRecord, key: string, min: number, max: number): number | undefined {
  if (!(key in item) || item[key] === null || item[key] === undefined || item[key] === '') {
    return undefined;
  }
  const value = readNumber(item, key, Number.NaN);
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${key} must be an integer between ${min} and ${max}`);
  }
  return value;
}

function readRetryableStatusCodes(item: ApiRecord, key: string): RetryableStatusCode[] {
  const rawValues = item[key];
  if (!Array.isArray(rawValues)) {
    throw new Error('Routing channel retryPolicy.retryableStatusCodes is required');
  }
  return normalizeRetryableStatusCodes(
    rawValues.map((value) => {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string' && value.trim()) {
        return Number.parseInt(value, 10);
      }
      return Number.NaN;
    }),
  );
}

function nullableString(item: ApiRecord, key: string): string | null {
  const value = readString(item, key).trim();
  return value || null;
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
