import type { CommerceRechargePackageMutationRequest } from '@sdkwork/clawrouter-backend-sdk';
import type { CouponBatchGenerateInput, CouponCreateInput } from './marketingService';

const DEFAULT_COUPON_TYPE: CouponCreateInput['type'] = 'amount';
const DEFAULT_BATCH_NAME = 'Coupon batch';
const DEFAULT_BATCH_PREFIX = 'COUPON';
const DEFAULT_BATCH_COUNT = 1;

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
    name: firstNonEmpty(readFormText(formData, 'batchName'), DEFAULT_BATCH_NAME),
    count: readPositiveInteger(formData, 'count'),
    prefix: firstNonEmpty(readFormText(formData, 'prefix'), DEFAULT_BATCH_PREFIX).toUpperCase(),
  };
}

export function createRechargePackageInputFromForm(formData: FormData): CommerceRechargePackageMutationRequest {
  return {
    rmb: readMoneyAmount(readFormText(formData, 'rmb'), 'rmb'),
    bonus: readNonNegativeInteger(readFormText(formData, 'bonus'), 'bonus'),
    status: readRechargePackageStatus(formData.get('status')),
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
  return DEFAULT_COUPON_TYPE;
}

function readPositiveInteger(formData: FormData, key: string): number {
  const value = Number(readFormText(formData, key));
  if (!Number.isFinite(value) || value < 1) {
    return DEFAULT_BATCH_COUNT;
  }
  return Math.round(value);
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

function firstNonEmpty(...values: string[]): string {
  for (const value of values) {
    const normalized = value.trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}
