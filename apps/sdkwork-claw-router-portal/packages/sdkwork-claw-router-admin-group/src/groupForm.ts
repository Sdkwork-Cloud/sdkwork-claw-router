import type { GroupCreateInput, GroupData, GroupUpdateInput } from './groupService';

export function createGroupInputFromForm(formData: FormData): GroupCreateInput {
  return {
    name: readFormText(formData, 'name'),
    platform: readFormText(formData, 'platform'),
    billingType: readFormText(formData, 'billingType'),
    rateMultiplier: readPositiveNumber(formData.get('rateMultiplier'), 1),
    type: formData.get('isPublic') ? 'public' : 'dedicated',
    capacity: { total: 100 },
    status: 'active',
  };
}

export function createGroupUpdateInputFromForm(formData: FormData): GroupUpdateInput {
  return {
    name: readFormText(formData, 'name'),
    platform: readFormText(formData, 'platform'),
    billingType: readFormText(formData, 'billingType'),
    rateMultiplier: readPositiveNumber(formData.get('rateMultiplier'), 1),
    type: formData.get('isPublic') ? 'public' : 'dedicated',
    capacity: { total: 100 },
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

function readPositiveNumber(value: FormDataEntryValue | null, fallback: number): number {
  if (typeof value !== 'string') {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
