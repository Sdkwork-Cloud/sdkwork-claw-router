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
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed.toFixed(2) : fallback;
}

function readPositiveCurrencyAmount(value: FormDataEntryValue | null): number {
  if (typeof value !== 'string') {
    return 0;
  }
  const normalized = value.trim().replace(/,/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? Number(parsed.toFixed(2)) : 0;
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
