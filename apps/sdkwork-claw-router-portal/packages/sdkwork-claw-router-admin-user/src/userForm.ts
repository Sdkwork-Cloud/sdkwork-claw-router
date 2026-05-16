import type { ApiKeyCreateInput, UserBalanceAdjustmentInput, UserCreateInput, UserUpdateInput } from './userService';

export function createUserInputFromForm(formData: FormData): UserCreateInput {
  return omitUndefined({
    email: readFormText(formData, 'email'),
    username: optionalFormText(formData, 'username'),
    balance: readCurrencyAmount(formData.get('balance'), '0.00'),
  });
}

export function createApiKeyInputFromForm(formData: FormData, userId: number): ApiKeyCreateInput {
  return {
    userId,
    name: optionalFormText(formData, 'keyName') ?? 'Default API Key',
  };
}

export function createUserBalanceAdjustmentInputFromForm(
  formData: FormData,
  type: UserBalanceAdjustmentInput['type'],
): UserBalanceAdjustmentInput {
  return {
    amount: readPositiveCurrencyAmount(formData.get('amount')),
    type,
  };
}

export function createUserProfileUpdateInputFromForm(formData: FormData): UserUpdateInput {
  return omitUndefined({
    username: optionalFormText(formData, 'username'),
  });
}

export function createUserGroupUpdateInputFromForm(formData: FormData): UserUpdateInput {
  return omitUndefined({
    group: optionalFormText(formData, 'group'),
  });
}

export function createUserStatusUpdateInput(status: string): UserUpdateInput {
  if (status === 'active' || status === 'banned') {
    return { status };
  }
  throw new Error('status must be active or banned');
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalFormText(formData: FormData, key: string): string | undefined {
  const value = readFormText(formData, key);
  return value ? value : undefined;
}

function readCurrencyAmount(value: FormDataEntryValue | null, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }
  const normalized = value.trim().replace(/,/g, '');
  if (!normalized) {
    return fallback;
  }
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) {
    throw new Error('balance must be a non-negative money amount');
  }
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error('balance must be a non-negative money amount');
  }
  return parsed.toFixed(2);
}

function readPositiveCurrencyAmount(value: FormDataEntryValue | null): number {
  if (typeof value !== 'string') {
    throw new Error('amount is required');
  }
  const normalized = value.trim().replace(/,/g, '');
  if (!normalized) {
    throw new Error('amount is required');
  }
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('amount must be greater than zero');
  }
  return Number(parsed.toFixed(2));
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
