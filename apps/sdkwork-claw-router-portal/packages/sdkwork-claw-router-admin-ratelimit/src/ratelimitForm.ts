import type {
  FirewallCreateInput,
  IpLimitCreateInput,
  ModelLimitCreateInput,
  TokenLimitCreateInput,
} from './ratelimitService';

const DEFAULT_BLOCK_DURATION = '10m';
const DEFAULT_KEY_PREFIX = 'sk-proj-...';
const DEFAULT_POSITIVE_INTEGER = 1;

export function createIpLimitInputFromForm(formData: FormData): IpLimitCreateInput {
  return {
    ruleName: readFormText(formData, 'ruleName'),
    targetIp: readFormText(formData, 'targetIp'),
    rps: readPositiveInteger(formData, 'rps'),
    rpm: readPositiveInteger(formData, 'rpm'),
    blockDuration: firstNonEmpty(readFormText(formData, 'blockDuration'), DEFAULT_BLOCK_DURATION),
  };
}

export function createTokenLimitInputFromForm(formData: FormData): TokenLimitCreateInput {
  return {
    keyPrefix: firstNonEmpty(readFormText(formData, 'keyPrefix'), DEFAULT_KEY_PREFIX),
    user: readFormText(formData, 'user'),
    rps: readPositiveInteger(formData, 'rps'),
    rpd: readPositiveInteger(formData, 'rpd'),
    burst: readPositiveInteger(formData, 'burst'),
  };
}

export function createModelLimitInputFromForm(formData: FormData): ModelLimitCreateInput {
  return {
    model: readFormText(formData, 'model'),
    group: readFormText(formData, 'group'),
    rpm: readPositiveInteger(formData, 'rpm'),
    tpm: readPositiveInteger(formData, 'tpm'),
  };
}

export function createFirewallInputFromForm(formData: FormData): FirewallCreateInput {
  return {
    type: readFormText(formData, 'type'),
    value: readFormText(formData, 'value'),
    reason: readFormText(formData, 'reason'),
  };
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readPositiveInteger(formData: FormData, key: string): number {
  const value = Number(readFormText(formData, key));
  if (!Number.isFinite(value) || value < 1) {
    return DEFAULT_POSITIVE_INTEGER;
  }
  return Math.round(value);
}

function firstNonEmpty(...values: string[]): string {
  for (const value of values) {
    const normalized = value.trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}
