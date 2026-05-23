export type CouponCreateInput = {
  name: string;
  type: 'amount' | 'discount';
  value: string;
};

export type CouponBatchGenerateInput = {
  couponId: string;
  name: string;
  count: number;
  prefix: string;
};

interface CommerceRechargePackageMutationRequest {
  bonus: number;
  rmb: string;
  status?: 'active' | 'inactive';
}

interface CommerceExchangeRuleUpdateRequest {
  rate: string;
  sourceAssetType: 'POINTS';
  status: 'active';
  targetAssetType: 'CASH';
}

const MAX_BATCH_COUNT = 10_000;
const MAX_BATCH_PREFIX_LENGTH = 32;

export function createCouponInputFromForm(formData: FormData): CouponCreateInput {
  return {
    name: readFormText(formData, 'name'),
    type: readCouponType(formData.get('type')),
    value: readFormText(formData, 'value'),
  };
}

export function createCouponBatchGenerateInputFromForm(
  formData: FormData,
  couponId: string,
): CouponBatchGenerateInput {
  return {
    couponId: couponId.trim(),
    name: readRequiredText(formData, 'batchName'),
    count: readPositiveInteger(formData, 'count'),
    prefix: readBatchPrefix(formData),
  };
}

export function createRechargePackageInputFromForm(formData: FormData): CommerceRechargePackageMutationRequest {
  return {
    rmb: readMoneyAmount(readFormText(formData, 'rmb'), 'rmb'),
    bonus: readNonNegativeInteger(readFormText(formData, 'bonus'), 'bonus'),
    status: readRechargePackageStatus(formData.get('status')),
  };
}

export function createExchangeRuleInputFromForm(formData: FormData): CommerceExchangeRuleUpdateRequest {
  return {
    sourceAssetType: 'POINTS',
    targetAssetType: 'CASH',
    rate: readExchangeRate(readFormText(formData, 'rate')),
    status: 'active',
  };
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readCouponType(value: FormDataEntryValue | null): CouponCreateInput['type'] {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'amount' || normalized === 'discount') {
    return normalized;
  }
  throw new Error('type must be amount or discount');
}

function readPositiveInteger(formData: FormData, key: string): number {
  const text = readFormText(formData, key);
  if (!/^\d+$/.test(text)) {
    throw new Error(`${key} must be a positive integer`);
  }
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value < 1 || value > MAX_BATCH_COUNT) {
    throw new Error(`${key} must be between 1 and ${MAX_BATCH_COUNT}`);
  }
  return value;
}

function readRequiredText(formData: FormData, key: string): string {
  const value = readFormText(formData, key);
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
}

function readBatchPrefix(formData: FormData): string {
  const prefix = readRequiredText(formData, 'prefix').toUpperCase();
  if (prefix.length > MAX_BATCH_PREFIX_LENGTH) {
    throw new Error(`prefix must be at most ${MAX_BATCH_PREFIX_LENGTH} characters`);
  }
  if (!/^[A-Z0-9_-]+$/.test(prefix)) {
    throw new Error('prefix may only contain letters, numbers, -, and _');
  }
  return prefix;
}

function readMoneyAmount(value: string, fieldName: string): string {
  const normalized = value.replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive money amount`);
  }
  if (!/[1-9]/.test(normalized.replace('.', ''))) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  const [whole, fraction = ''] = normalized.split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

function readNonNegativeInteger(value: string, fieldName: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  const numberValue = Number(value);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return numberValue;
}

function readRechargePackageStatus(value: FormDataEntryValue | null): CommerceRechargePackageMutationRequest['status'] {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (normalized === 'active' || normalized === 'inactive') {
    return normalized;
  }
  throw new Error('status must be active or inactive');
}

function readExchangeRate(value: string): string {
  const normalized = value.replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,6})?$/.test(normalized)) {
    throw new Error('rate must be a positive decimal string with at most 6 decimal places');
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric) || numeric < 1 || numeric > 1_000_000) {
    throw new Error('rate must be between 1 and 1000000');
  }
  return normalized;
}
