import {
  ensureSdkworkApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  optionalBoundedPositiveInteger,
  optionalPositiveInteger,
  optionalText,
  readApiData,
  readRequiredApiItem,
  readRequiredApiItems,
  readRequiredNonNegativeNumber,
  readRequiredNumber,
  readRequiredString,
  readString,
  readMediaResource,
  type ApiRecord,
  type ClawRouterMediaResource,
} from 'sdkwork-claw-router-commons/runtime';
import type { JsonValue } from '@sdkwork/clawrouter-backend-sdk';

export interface AdminAgentPolicyDocument extends Record<string, JsonValue> {}

export interface AdminAgentCapabilities {
  memoryEnabled: boolean;
  mcpServerCount: number;
  skillBindingCount: number;
}

export interface AdminAgentVersion {
  id: string;
  versionNo: number;
  releaseStatus: 'draft' | 'published' | 'archived';
  model: string | null;
  systemPrompt: string;
  toolPolicy: AdminAgentPolicyDocument;
  memoryPolicy: AdminAgentPolicyDocument;
  mcpPolicy: AdminAgentPolicyDocument;
  skillPolicy: AdminAgentPolicyDocument;
  runtimePolicy: AdminAgentPolicyDocument;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAgentItem {
  id: string;
  ownerUserId: number;
  code: string;
  name: string;
  description: string;
  visibility: 'private' | 'organization' | 'public';
  status: 'active' | 'disabled';
  avatar?: ClawRouterMediaResource;
  templateSource: string | null;
  createdAt: string;
  updatedAt: string;
  defaultVersion: AdminAgentVersion;
  capabilities: AdminAgentCapabilities;
}

export interface AdminAgentListQuery {
  q?: string;
  ownerUserId?: number;
  status?: AdminAgentItem['status'];
  visibility?: AdminAgentItem['visibility'];
  page?: number;
  pageSize?: number;
}

type BackendAgents = ReturnType<typeof getClawRouterBackendSdkClient>['agents'];
type BackendAgentsListParams = NonNullable<Parameters<BackendAgents['agentDefinitions']['list']>[0]>;

export class AdminAgentService {
  static async listAgents(query: AdminAgentListQuery = {}): Promise<AdminAgentItem[]> {
    try {
      const result = await backendAgentsSdk().agentDefinitions.list(normalizeListQuery(query));
      ensureSdkworkApiSuccess(result, 'Failed to load agent list');
      return readRequiredApiItems(result, 'Agent list response is missing data').map(normalizeAdminAgentItem);
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'Failed to load agent list'));
    }
  }

  static async retrieveAgent(agentId: string): Promise<AdminAgentItem> {
    try {
      const result = await backendAgentsSdk().agentDefinitions.retrieve(requiredAgentId(agentId));
      ensureSdkworkApiSuccess(result, 'Failed to load agent details');
      return normalizeAdminAgentItem(readRequiredApiItem(result, 'Agent details response is missing data'));
    } catch (error) {
      throw new Error(readSdkErrorMessage(error, 'Failed to load agent details'));
    }
  }
}

function backendAgentsSdk(): BackendAgents {
  return getClawRouterBackendSdkClient().agents;
}

function normalizeListQuery(query: AdminAgentListQuery): BackendAgentsListParams {
  const normalized: BackendAgentsListParams = {};
  const q = optionalText(query.q, 'q', 128);
  if (q) {
    normalized.q = q;
  }
  const ownerUserId = optionalPositiveInteger(query.ownerUserId, 'ownerUserId');
  if (ownerUserId !== undefined) {
    normalized.ownerUserId = ownerUserId;
  }
  if (query.status !== undefined) {
    normalized.status = requiredAgentStatus(query.status);
  }
  if (query.visibility !== undefined) {
    normalized.visibility = requiredAgentVisibility(query.visibility);
  }
  const page = optionalPositiveInteger(query.page, 'page');
  if (page !== undefined) {
    normalized.page = page;
  }
  const pageSize = optionalBoundedPositiveInteger(query.pageSize, 'pageSize', 100);
  if (pageSize !== undefined) {
    normalized.pageSize = pageSize;
  }
  return normalized;
}

function normalizeAdminAgentItem(value: unknown): AdminAgentItem {
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
    avatar: readMediaResource(item.avatar),
    templateSource: readNullableField(item, 'templateSource'),
    createdAt: readRequiredString(item, 'createdAt', 'Agent created time is required'),
    updatedAt: readRequiredString(item, 'updatedAt', 'Agent updated time is required'),
    defaultVersion: normalizeAgentVersion(defaultVersion),
    capabilities: {
      memoryEnabled: capabilities.memoryEnabled === true,
      mcpServerCount: readRequiredNonNegativeNumber(capabilities, 'mcpServerCount', 'Agent MCP server count is required'),
      skillBindingCount: readRequiredNonNegativeNumber(capabilities, 'skillBindingCount', 'Agent skill binding count is required'),
    },
  };
}

function normalizeAgentVersion(value: ApiRecord): AdminAgentVersion {
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

function readPolicy(record: ApiRecord, key: string): AdminAgentPolicyDocument {
  const value = record[key];
  return isRecord(value) ? value as AdminAgentPolicyDocument : {};
}

function readAgentVisibility(record: ApiRecord): AdminAgentItem['visibility'] {
  return requiredAgentVisibility(readRequiredString(record, 'visibility', 'Agent visibility is required'));
}

function requiredAgentVisibility(value: string): AdminAgentItem['visibility'] {
  const normalized = value.toLowerCase();
  if (normalized === 'private' || normalized === 'organization' || normalized === 'public') {
    return normalized;
  }
  throw new Error(`Unsupported agent visibility: ${value}`);
}

function readAgentStatus(record: ApiRecord): AdminAgentItem['status'] {
  return requiredAgentStatus(readRequiredString(record, 'status', 'Agent status is required'));
}

function requiredAgentStatus(value: string): AdminAgentItem['status'] {
  const normalized = value.toLowerCase();
  if (normalized === 'active' || normalized === 'disabled') {
    return normalized;
  }
  throw new Error(`Unsupported agent status: ${value}`);
}

function readReleaseStatus(record: ApiRecord): AdminAgentVersion['releaseStatus'] {
  const value = readRequiredString(record, 'releaseStatus', 'Agent release status is required').toLowerCase();
  if (value === 'draft' || value === 'published' || value === 'archived') {
    return value;
  }
  throw new Error(`Unsupported agent release status: ${value}`);
}

function requiredAgentId(value: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error('agent id is required');
  }
  if (!/^[A-Za-z0-9._~-]{1,128}$/u.test(normalized)) {
    throw new Error('agent id contains unsupported characters');
  }
  return normalized;
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
