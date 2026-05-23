import type { ApiKeyCreateInput, UserCreateInput, UserUpdateInput } from './userService';

export type UserBalanceAdjustmentInput = {
  amount: number;
  type: 'recharge' | 'refund';
};

export function createUserInputFromForm(formData: FormData): UserCreateInput {
  return omitUndefined({
    email: readFormText(formData, 'email'),
    username: optionalFormText(formData, 'username'),
    balance: readMoneyAmount(formData, 'balance', { defaultValue: '0.00' }),
  });
}

export function createApiKeyInputFromForm(formData: FormData, userId: number): ApiKeyCreateInput {
  return {
    userId,
    name: optionalFormText(formData, 'keyName') ?? 'Default API Key',
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

export function createUserBalanceAdjustmentInputFromForm(
  formData: FormData,
  type: UserBalanceAdjustmentInput['type'],
): UserBalanceAdjustmentInput {
  if (type !== 'recharge' && type !== 'refund') {
    throw new Error('type must be recharge or refund');
  }
  const rawAmount = readFormText(formData, 'amount');
  if (!rawAmount) {
    throw new Error('amount is required');
  }
  const amount = Number(rawAmount.replace(/,/g, ''));
  if (!Number.isFinite(amount)) {
    throw new Error('amount must be a money amount');
  }
  if (amount <= 0) {
    throw new Error('amount must be greater than zero');
  }
  return {
    amount: Math.round(amount * 100) / 100,
    type,
  };
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function optionalFormText(formData: FormData, key: string): string | undefined {
  const value = readFormText(formData, key);
  return value ? value : undefined;
}

function readMoneyAmount(
  formData: FormData,
  key: string,
  options: { defaultValue?: string } = {},
): string | undefined {
  const value = readFormText(formData, key).replace(/,/g, '');
  if (!value) {
    return options.defaultValue;
  }
  if (!/^\d+(?:\.\d+)?$/.test(value)) {
    throw new Error(`${key} must be a non-negative money amount`);
  }
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`${key} must be a non-negative money amount`);
  }
  return amount.toFixed(2);
}

function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}
