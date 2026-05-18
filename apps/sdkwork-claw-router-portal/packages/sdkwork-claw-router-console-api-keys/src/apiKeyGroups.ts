import type { ApiKeyGroup } from './apiKeyService';

export function resolveApiKeyGroupName(groupCode: string, groups: ApiKeyGroup[]): string {
  const normalizedCode = groupCode.trim();
  const group = groups.find((item) => item.code === normalizedCode || item.id === normalizedCode);
  return group?.name?.trim() || normalizedCode;
}

export function resolveApiKeyGroupCode(groupValue: string, groups: ApiKeyGroup[]): string {
  const normalizedValue = groupValue.trim();
  const group = groups.find((item) => item.code === normalizedValue || item.id === normalizedValue);
  return group?.code?.trim() || normalizedValue;
}

export function formatApiKeyGroupOptionLabel(group: ApiKeyGroup): string {
  const name = group.name.trim() || group.code;
  return group.rate ? `${name} (${group.rate})` : name;
}
