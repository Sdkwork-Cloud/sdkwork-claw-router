import type { GroupCreateInput, GroupData, GroupUpdateInput } from './groupService';

export function createGroupInputFromForm(formData: FormData): GroupCreateInput {
  return {
    name: readFormText(formData, 'name'),
    platform: readFormText(formData, 'platform'),
    billingType: readFormText(formData, 'billingType'),
    rateMultiplier: readPositiveNumber(formData.get('rateMultiplier'), 'rateMultiplier'),
    type: readGroupType(formData.get('type')),
    capacity: { total: readPositiveInteger(formData.get('capacityTotal'), 'capacityTotal') },
    status: 'active',
  };
}

export function createGroupUpdateInputFromForm(formData: FormData): GroupUpdateInput {
  return {
    name: readFormText(formData, 'name'),
    platform: readFormText(formData, 'platform'),
    billingType: readFormText(formData, 'billingType'),
    rateMultiplier: readPositiveNumber(formData.get('rateMultiplier'), 'rateMultiplier'),
    type: readGroupType(formData.get('type')),
    capacity: { total: readPositiveInteger(formData.get('capacityTotal'), 'capacityTotal') },
    status: 'active',
  };
}

export function displayGroupType(type: GroupData['type']): string {
  return type === 'dedicated' ? 'dedicated' : 'public';
}

export function displayGroupStatus(status: GroupData['status']): string {
  return status === 'disabled' ? 'disabled' : 'active';
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readPositiveNumber(value: FormDataEntryValue | null, fieldName: string): number {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return parsed;
}

function readPositiveInteger(value: FormDataEntryValue | null, fieldName: string): number {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return parsed;
}

function readGroupType(value: FormDataEntryValue | null): GroupCreateInput['type'] {
  if (typeof value !== 'string') {
    throw new Error('type must be public or dedicated');
  }
  const normalized = value.trim();
  if (normalized === 'public' || normalized === 'dedicated') {
    return normalized;
  }
  throw new Error('type must be public or dedicated');
}
