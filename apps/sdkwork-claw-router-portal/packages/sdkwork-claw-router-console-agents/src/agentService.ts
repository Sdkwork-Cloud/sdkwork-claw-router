import {
  createRequestToken,
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiData,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredNonNegativeNumber,
  readRequiredNumber,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AgentCreateRequest,
  AgentItem as SdkAgentItem,
  JsonValue,
} from '@sdkwork/clawrouter-app-sdk';

export interface AgentPolicyDocument extends Record<string, JsonValue> {}

export interface AgentCapabilities {
  memoryEnabled: boolean;
  mcpServerCount: number;
  skillBindingCount: number;
}

export interface AgentVersion {
  id: string;
  versionNo: number;
  releaseStatus: 'draft' | 'published' | 'archived';
  model: string | null;
  systemPrompt: string;
  toolPolicy: AgentPolicyDocument;
  memoryPolicy: AgentPolicyDocument;
  mcpPolicy: AgentPolicyDocument;
  skillPolicy: AgentPolicyDocument;
  runtimePolicy: AgentPolicyDocument;
  createdAt: string;
  updatedAt: string;
}

export interface AgentDefinition {
  id: string;
  ownerUserId: number;
  code: string;
  name: string;
  description: string;
  visibility: 'private' | 'organization' | 'public';
  status: 'active' | 'disabled';
  avatarUrl: string | null;
  templateSource: string | null;
  createdAt: string;
  updatedAt: string;
  defaultVersion: AgentVersion;
  capabilities: AgentCapabilities;
}

export interface AgentListQuery {
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface CreateAgentInput {
  name: string;
  code?: string;
  description?: string;
  model?: string;
  systemPrompt?: string;
  memoryEnabled?: boolean;
  mcpServers?: string[];
  skills?: string[];
  executionMode?: string;
}

type AppAgentsSdk = ReturnType<typeof getClawRouterAppSdkClient>['agents']['agentDefinitions'];
type AppAgentsListParams = NonNullable<Parameters<AppAgentsSdk['list']>[0]>;

export class AgentService {
  static async listAgents(query: AgentListQuery = {}): Promise<AgentDefinition[]> {
    try {
      const result = await appAgentsSdk().list(normalizeListQuery(query));
      ensureSdkworkApiSuccess(result, 'console.agents.errors.loadFailed');
      return readRequiredApiItems(result, 'console.agents.errors.loadFailed').map(normalizeAgentDefinition);
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.agents.errors.loadFailed'));
    }
  }

  static async retrieveAgent(agentId: string): Promise<AgentDefinition> {
    try {
      const result = await appAgentsSdk().retrieve(requiredText(agentId, 'agentId'));
      ensureSdkworkApiSuccess(result, 'console.agents.errors.detailLoadFailed');
      return normalizeAgentDefinition(readRequiredApiItem(result, 'console.agents.errors.detailLoadFailed'));
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.agents.errors.detailLoadFailed'));
    }
  }

  static async createAgent(input: CreateAgentInput): Promise<AgentDefinition> {
    const body = toCreateAgentRequest(input);
    const idempotencyKey = createRequestToken('create-agent');
    const requestId = createRequestToken('request');
    try {
      const result = await appAgentsSdk().create(
        body,
        { idempotencyKey, xRequestId: requestId },
      );
      ensureSdkworkApiSuccess(result, 'console.agents.errors.createFailed');
      return normalizeAgentDefinition(readRequiredApiItem(result, 'console.agents.errors.createFailed'));
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'console.agents.errors.createFailed'));
    }
  }
}

function appAgentsSdk(): AppAgentsSdk {
  return getClawRouterAppSdkClient().agents.agentDefinitions;
}

function normalizeListQuery(query: AgentListQuery): AppAgentsListParams {
  const normalized: AppAgentsListParams = {};
  if (query.page !== undefined) {
    normalized.page = positiveInteger(query.page, 'page');
  }
  if (query.pageSize !== undefined) {
    normalized.pageSize = positiveInteger(query.pageSize, 'pageSize');
  }
  const keyword = optionalText(query.q);
  if (keyword) {
    normalized.q = keyword;
  }
  return normalized;
}

function toCreateAgentRequest(input: CreateAgentInput): AgentCreateRequest {
  const mcpServers = uniqueTextList(input.mcpServers ?? []);
  const skills = uniqueTextList(input.skills ?? []);
  const executionMode = optionalText(input.executionMode) ?? 'interactive';

  return {
    name: requiredText(input.name, 'name'),
    code: optionalText(input.code),
    description: optionalText(input.description),
    model: optionalText(input.model),
    systemPrompt: optionalText(input.systemPrompt),
    toolPolicy: {},
    memoryPolicy: { enabled: Boolean(input.memoryEnabled) },
    mcpPolicy: mcpServers.length > 0 ? { servers: mcpServers } : {},
    skillPolicy: skills.length > 0 ? { skills } : {},
    runtimePolicy: { executionMode },
  };
}

function normalizeAgentDefinition(value: unknown): AgentDefinition {
  const item = requiredRecord(value, 'Agent record is required');
  const defaultVersion = requiredRecord(item.defaultVersion, 'Agent default version is required');
  const capabilities = requiredRecord(item.capabilities, 'Agent capabilities are required');

  return {
    id: readRequiredString(item, 'id', 'Agent id is required'),
    ownerUserId: readRequiredNumber(item, 'ownerUserId', 'Agent owner user id is required'),
    code: readRequiredString(item, 'code', 'Agent code is required'),
    name: readRequiredString(item, 'name', 'Agent name is required'),
    description: readString(item, 'description'),
    visibility: readAgentVisibility(item),
    status: readAgentStatus(item),
    avatarUrl: readNullableField(item, 'avatarUrl'),
    templateSource: readNullableField(item, 'templateSource'),
    createdAt: readRequiredString(item, 'createdAt', 'Agent created time is required'),
    updatedAt: readRequiredString(item, 'updatedAt', 'Agent updated time is required'),
    defaultVersion: normalizeAgentVersion(defaultVersion),
    capabilities: {
      memoryEnabled: capabilities.memoryEnabled === true,
      mcpServerCount: readRequiredNonNegativeNumber(capabilities, 'mcpServerCount', 'Agent MCP server count is required'),
      skillBindingCount: readRequiredNonNegativeNumber(capabilities, 'skillBindingCount', 'Agent skill binding count is required'),
    },
  } satisfies SdkAgentItem;
}

function normalizeAgentVersion(value: ApiRecord): AgentVersion {
  return {
    id: readRequiredString(value, 'id', 'Agent version id is required'),
    versionNo: readRequiredNumber(value, 'versionNo', 'Agent version number is required'),
    releaseStatus: readReleaseStatus(value),
    model: readNullableField(value, 'model'),
    systemPrompt: readString(value, 'systemPrompt'),
    toolPolicy: readPolicy(value, 'toolPolicy'),
    memoryPolicy: readPolicy(value, 'memoryPolicy'),
    mcpPolicy: readPolicy(value, 'mcpPolicy'),
    skillPolicy: readPolicy(value, 'skillPolicy'),
    runtimePolicy: readPolicy(value, 'runtimePolicy'),
    createdAt: readRequiredString(value, 'createdAt', 'Agent version created time is required'),
    updatedAt: readRequiredString(value, 'updatedAt', 'Agent version updated time is required'),
  };
}

function readPolicy(record: ApiRecord, key: string): AgentPolicyDocument {
  const value = record[key];
  return isRecord(value) ? value as AgentPolicyDocument : {};
}

function readAgentVisibility(record: ApiRecord): AgentDefinition['visibility'] {
  const value = readRequiredString(record, 'visibility', 'Agent visibility is required').toLowerCase();
  if (value === 'private' || value === 'organization' || value === 'public') {
    return value;
  }
  throw new Error(`Unsupported agent visibility: ${value}`);
}

function readAgentStatus(record: ApiRecord): AgentDefinition['status'] {
  const value = readRequiredString(record, 'status', 'Agent status is required').toLowerCase();
  if (value === 'active' || value === 'disabled') {
    return value;
  }
  throw new Error(`Unsupported agent status: ${value}`);
}

function readReleaseStatus(record: ApiRecord): AgentVersion['releaseStatus'] {
  const value = readRequiredString(record, 'releaseStatus', 'Agent release status is required').toLowerCase();
  if (value === 'draft' || value === 'published' || value === 'archived') {
    return value;
  }
  throw new Error(`Unsupported agent release status: ${value}`);
}

function requiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readNullableField(record: ApiRecord, key: string): string | null {
  const value = record[key];
  if (value === undefined || value === null || value === '') {
    return null;
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return null;
}

function requiredText(value: string | undefined, fieldName: string): string {
  const normalized = optionalText(value);
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim() ?? '';
  return normalized ? normalized : undefined;
}

function positiveInteger(value: number, fieldName: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function uniqueTextList(values: string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    const normalized = value.trim();
    if (normalized && !result.includes(normalized)) {
      result.push(normalized);
    }
  }
  return result;
}

function readSdkErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message && message !== 'Unknown error') {
      return message;
    }
  }
  const data = readApiData(error);
  if (isRecord(data)) {
    const message = readString(data, 'msg') || readString(data, 'message');
    if (message) {
      return message;
    }
  }
  return fallback;
}
