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

function firstNonEmpty(...values: string[]): string {
  for (const value of values) {
    const normalized = value.trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}
