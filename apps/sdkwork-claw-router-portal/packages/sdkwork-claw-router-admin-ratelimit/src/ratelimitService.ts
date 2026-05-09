import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredApiItem,
  readNumber,
  readRequiredNumber,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminFirewallRuleCreateRequest,
  AdminIpLimitCreateRequest,
  AdminModelLimitCreateRequest,
  AdminTokenLimitCreateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export interface IpLimitRule {
  id: string;
  ruleName: string;
  targetIp: string;
  rps: number;
  rpm: number;
  blockDuration: string;
  status: 'active' | 'inactive';
}

export interface TokenLimitRule {
  id: string;
  keyPrefix: string;
  user: string;
  rps: number;
  rpd: number;
  burst: number;
  status: 'active' | 'exhausted';
}

export interface ModelLimitRule {
  id: string;
  model: string;
  group: string;
  rpm: number;
  tpm: number;
  status: 'active' | 'inactive';
}

export interface FirewallRule {
  id: string;
  type: string;
  value: string;
  reason: string;
  time: string;
}

export type IpLimitCreateInput = {
  ruleName: string;
  targetIp: string;
  rps: number;
  rpm: number;
  blockDuration: string;
};

export type TokenLimitCreateInput = {
  keyPrefix: string;
  user: string;
  rps: number;
  rpd: number;
  burst: number;
};

export type ModelLimitCreateInput = {
  model: string;
  group: string;
  rpm: number;
  tpm: number;
};

export type FirewallCreateInput = {
  type: string;
  value: string;
  reason: string;
};

export class RateLimitService {
  static async fetchIpLimits(): Promise<IpLimitRule[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchIpLimits();
    ensurePlusApiSuccess(result, 'Failed to fetch IP limits');
    return readRequiredApiItems(result, 'Failed to fetch IP limits')
      .map(normalizeIpLimit);
  }

  static async addIpLimit(rule: IpLimitCreateInput): Promise<IpLimitRule> {
    const result = await getClawRouterBackendSdkClient().router.addIpLimit(
      toCreateIpLimitRequest(rule),
      requestToken('admin-ip-limit-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add IP limit');
    return normalizeIpLimit(readRequiredApiItem(result, 'Created IP limit response is missing data'));
  }

  static async fetchTokenLimits(): Promise<TokenLimitRule[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchTokenLimits();
    ensurePlusApiSuccess(result, 'Failed to fetch token limits');
    return readRequiredApiItems(result, 'Failed to fetch token limits')
      .map(normalizeTokenLimit);
  }

  static async addTokenLimit(rule: TokenLimitCreateInput): Promise<TokenLimitRule> {
    const result = await getClawRouterBackendSdkClient().router.addTokenLimit(
      toCreateTokenLimitRequest(rule),
      requestToken('admin-token-limit-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add token limit');
    return normalizeTokenLimit(readRequiredApiItem(result, 'Created token limit response is missing data'));
  }

  static async fetchModelLimits(): Promise<ModelLimitRule[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchModelLimits();
    ensurePlusApiSuccess(result, 'Failed to fetch model limits');
    return readRequiredApiItems(result, 'Failed to fetch model limits')
      .map(normalizeModelLimit);
  }

  static async addModelLimit(rule: ModelLimitCreateInput): Promise<ModelLimitRule> {
    const result = await getClawRouterBackendSdkClient().router.addModelLimit(
      toCreateModelLimitRequest(rule),
      requestToken('admin-model-limit-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add model limit');
    return normalizeModelLimit(readRequiredApiItem(result, 'Created model limit response is missing data'));
  }

  static async fetchFirewalls(): Promise<FirewallRule[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchFirewalls();
    ensurePlusApiSuccess(result, 'Failed to fetch firewall rules');
    return readRequiredApiItems(result, 'Failed to fetch firewall rules')
      .map(normalizeFirewall);
  }

  static async addFirewall(rule: FirewallCreateInput): Promise<FirewallRule> {
    const result = await getClawRouterBackendSdkClient().router.addFirewall(
      toCreateFirewallRequest(rule),
      requestToken('admin-firewall-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add firewall rule');
    return normalizeFirewall(readRequiredApiItem(result, 'Created firewall rule response is missing data'));
  }

  static async removeFirewall(id: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().router.removeFirewall(
      requiredSafePathSegment(id, 'firewallRuleId'),
    );
    ensurePlusApiSuccess(result, 'Failed to remove firewall rule');
    return true;
  }
}

function toCreateIpLimitRequest(rule: IpLimitCreateInput): AdminIpLimitCreateRequest {
  return {
    ruleName: requiredText(rule.ruleName, 'ruleName'),
    targetIp: requiredText(rule.targetIp, 'targetIp'),
    rps: positiveInteger(rule.rps, 'rps'),
    rpm: positiveInteger(rule.rpm, 'rpm'),
    blockDuration: requiredText(rule.blockDuration, 'blockDuration'),
  };
}

function toCreateTokenLimitRequest(rule: TokenLimitCreateInput): AdminTokenLimitCreateRequest {
  return {
    keyPrefix: requiredText(rule.keyPrefix, 'keyPrefix'),
    user: requiredText(rule.user, 'user'),
    rps: positiveInteger(rule.rps, 'rps'),
    rpd: positiveInteger(rule.rpd, 'rpd'),
    burst: positiveInteger(rule.burst, 'burst'),
  };
}

function toCreateModelLimitRequest(rule: ModelLimitCreateInput): AdminModelLimitCreateRequest {
  return {
    model: requiredText(rule.model, 'model'),
    group: requiredText(rule.group, 'group'),
    rpm: positiveInteger(rule.rpm, 'rpm'),
    tpm: positiveInteger(rule.tpm, 'tpm'),
  };
}

function toCreateFirewallRequest(rule: FirewallCreateInput): AdminFirewallRuleCreateRequest {
  return {
    type: requiredText(rule.type, 'type'),
    value: requiredText(rule.value, 'value'),
    reason: requiredText(rule.reason, 'reason'),
  };
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function positiveInteger(value: number, fieldName: string): number {
  if (!Number.isFinite(value) || value < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return Math.round(value);
}

function requestToken(scope: string): string {
  return createRequestToken(scope);
}

function normalizeIpLimit(value: unknown): IpLimitRule {
  const item = readRequiredRecord(value, 'IP limit record is required');
  return {
    id: readRequiredString(item, 'id', 'IP limit id is required'),
    ruleName: readRequiredString(item, 'ruleName', 'IP limit rule name is required'),
    targetIp: readRequiredString(item, 'targetIp', 'IP limit target IP is required'),
    rps: readRequiredNumber(item, 'rps', 'IP limit rps is required'),
    rpm: readRequiredNumber(item, 'rpm', 'IP limit rpm is required'),
    blockDuration: readRequiredString(item, 'blockDuration', 'IP limit block duration is required'),
    status: readString(item, 'status') === 'inactive' ? 'inactive' : 'active',
  };
}

function normalizeTokenLimit(value: unknown): TokenLimitRule {
  const item = readRequiredRecord(value, 'Token limit record is required');
  return {
    id: readRequiredString(item, 'id', 'Token limit id is required'),
    keyPrefix: readRequiredString(item, 'keyPrefix', 'Token limit key prefix is required'),
    user: readRequiredString(item, 'user', 'Token limit user is required'),
    rps: readRequiredNumber(item, 'rps', 'Token limit rps is required'),
    rpd: readRequiredNumber(item, 'rpd', 'Token limit rpd is required'),
    burst: readRequiredNumber(item, 'burst', 'Token limit burst is required'),
    status: readString(item, 'status') === 'exhausted' ? 'exhausted' : 'active',
  };
}

function normalizeModelLimit(value: unknown): ModelLimitRule {
  const item = readRequiredRecord(value, 'Model limit record is required');
  return {
    id: readRequiredString(item, 'id', 'Model limit id is required'),
    model: readRequiredString(item, 'model', 'Model limit model is required'),
    group: readRequiredString(item, 'group', 'Model limit group is required'),
    rpm: readRequiredNumber(item, 'rpm', 'Model limit rpm is required'),
    tpm: readRequiredNumber(item, 'tpm', 'Model limit tpm is required'),
    status: readString(item, 'status') === 'inactive' ? 'inactive' : 'active',
  };
}

function normalizeFirewall(value: unknown): FirewallRule {
  const item = readRequiredRecord(value, 'Firewall rule record is required');
  return {
    id: readRequiredString(item, 'id', 'Firewall rule id is required'),
    type: readRequiredString(item, 'type', 'Firewall rule type is required'),
    value: readRequiredString(item, 'value', 'Firewall rule value is required'),
    reason: readRequiredString(item, 'reason', 'Firewall rule reason is required'),
    time: readRequiredString(item, 'time', 'Firewall rule time is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
