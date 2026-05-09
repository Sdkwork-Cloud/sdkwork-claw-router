import {
  createRequestToken,
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readRequiredApiItem,
  readRequiredNonNegativeNumber,
  readRequiredNumber,
  requiredSafePathSegment,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  AdminCouponBatchGenerateRequest,
  AdminCouponCreateRequest,
  AdminPromoCodeStatusUpdateRequest,
} from '@sdkwork/clawrouter-backend-sdk';

export interface Coupon {
  id: string;
  name: string;
  type: string;
  value: string;
  status: 'active' | 'inactive';
}

export interface Batch {
  id: string;
  couponId: string;
  name: string;
  count: number;
  prefix: string;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  batchId: string;
  code: string;
  status: 'available' | 'claimed' | 'used' | 'voided';
  usedBy?: string;
  usedAt?: string;
}

export interface RedemptionRecord {
  id: string;
  userId: string;
  user: string;
  code: string;
  amount: string;
  time: string;
}

export interface RechargeRecord {
  id: string;
  tradeNo: string;
  userId: string;
  user: string;
  amount: string;
  usd_credited: string;
  method: string;
  status: 'success' | 'pending' | 'failed' | 'closed';
  time: string;
}

export interface ReferralStat {
  id: string;
  inviter: string;
  total_invited: number;
  total_revenue: string;
  bonus_awarded: string;
  link: string;
}

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

export class MarketingService {
  static async fetchCoupons(): Promise<Coupon[]> {
    const result = await getClawRouterBackendSdkClient().coupon.fetchCoupons();
    ensurePlusApiSuccess(result, 'Failed to fetch coupons');
    return readRequiredApiItems(result, 'Failed to fetch coupons')
      .map(normalizeCoupon);
  }

  static async fetchBatches(): Promise<Batch[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchBatches();
    ensurePlusApiSuccess(result, 'Failed to fetch coupon batches');
    return readRequiredApiItems(result, 'Failed to fetch coupon batches')
      .map(normalizeBatch);
  }

  static async fetchPromoCodes(): Promise<PromoCode[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchPromoCodes();
    ensurePlusApiSuccess(result, 'Failed to fetch promo codes');
    return readRequiredApiItems(result, 'Failed to fetch promo codes')
      .map(normalizePromoCode);
  }

  static async fetchRedemptionRecords(): Promise<RedemptionRecord[]> {
    const result = await getClawRouterBackendSdkClient().user.fetchRedemptionRecords();
    ensurePlusApiSuccess(result, 'Failed to fetch redemption records');
    return readRequiredApiItems(result, 'Failed to fetch redemption records')
      .map(normalizeRedemptionRecord);
  }

  static async fetchRechargeRecords(): Promise<RechargeRecord[]> {
    const result = await getClawRouterBackendSdkClient().vip.fetchRechargeRecords();
    ensurePlusApiSuccess(result, 'Failed to fetch recharge records');
    return readRequiredApiItems(result, 'Failed to fetch recharge records')
      .map(normalizeRechargeRecord);
  }

  static async fetchReferralStats(): Promise<ReferralStat[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchReferralStats();
    ensurePlusApiSuccess(result, 'Failed to fetch referral stats');
    return readRequiredApiItems(result, 'Failed to fetch referral stats')
      .map(normalizeReferralStat);
  }

  static async addCoupon(coupon: CouponCreateInput): Promise<Coupon> {
    const result = await getClawRouterBackendSdkClient().coupon.add(
      toCreateCouponRequest(coupon),
      requestToken('admin-coupon-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add coupon');
    return normalizeCoupon(readRequiredApiItem(result, 'Created coupon response is missing data'));
  }

  static async deleteCoupon(id: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().coupon.deleteCoupon(requiredSafePathSegment(id, 'couponId'));
    ensurePlusApiSuccess(result, 'Failed to delete coupon');
    return true;
  }

  static async generateBatch(batch: CouponBatchGenerateInput): Promise<{ batch: Batch; codes: PromoCode[] }> {
    const result = await getClawRouterBackendSdkClient().router.generateBatch(
      toGenerateBatchRequest(batch),
      requestToken('admin-coupon-batch-generate'),
    );
    ensurePlusApiSuccess(result, 'Failed to generate promo code batch');
    const data = readApiRecord(result);
    const batchItem = isRecord(data.batch)
      ? data.batch
      : readRequiredApiItem(result, 'Generated promo code batch response is missing data');
    return {
      batch: normalizeBatch(batchItem),
      codes: readRequiredApiItems(data, 'Generated promo code batch response is missing codes', ['codes'])
        .map(normalizePromoCode),
    };
  }

  static async updatePromoCodeStatus(id: string, status: PromoCode['status']): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().router.updatePromoCodeStatus(
      requiredSafePathSegment(id, 'promoCodeId'),
      toUpdatePromoCodeStatusRequest(status),
      requestToken('admin-promo-code-status-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update promo code status');
    return true;
  }
}

function toCreateCouponRequest(coupon: CouponCreateInput): AdminCouponCreateRequest {
  return {
    name: requiredText(coupon.name, 'name'),
    type: couponType(coupon.type),
    value: requiredText(coupon.value, 'value'),
  };
}

function toGenerateBatchRequest(batch: CouponBatchGenerateInput): AdminCouponBatchGenerateRequest {
  return {
    couponId: positiveId(batch.couponId, 'couponId'),
    name: requiredText(batch.name, 'name'),
    count: positiveInteger(batch.count, 'count', 10000),
    prefix: codePrefix(batch.prefix),
  };
}

function toUpdatePromoCodeStatusRequest(status: PromoCode['status']): AdminPromoCodeStatusUpdateRequest {
  return { status: promoCodeStatus(status) };
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function couponType(value: string): AdminCouponCreateRequest['type'] {
  const normalized = requiredText(value, 'type').toLowerCase();
  if (normalized === 'amount' || normalized === 'discount') {
    return normalized;
  }
  throw new Error('type must be amount or discount');
}

function positiveId(value: string, fieldName: string): number {
  const normalized = Number(requiredText(value, fieldName));
  if (!Number.isInteger(normalized) || normalized < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return normalized;
}

function positiveInteger(value: number, fieldName: string, maxValue: number): number {
  if (!Number.isInteger(value) || value < 1 || value > maxValue) {
    throw new Error(`${fieldName} must be between 1 and ${maxValue}`);
  }
  return value;
}

function codePrefix(value: string): string {
  const normalized = requiredText(value, 'prefix').toUpperCase();
  if (normalized.length > 32) {
    throw new Error('prefix must be at most 32 characters');
  }
  if (!/^[A-Z0-9_-]+$/.test(normalized)) {
    throw new Error('prefix may only contain letters, numbers, -, and _');
  }
  return normalized;
}

function requestToken(scope: string): string {
  return createRequestToken(scope);
}

function normalizeCoupon(value: unknown): Coupon {
  const item = readRequiredRecord(value, 'Coupon record is required');
  const type = readCouponType(item);
  return {
    id: readRequiredString(item, 'id', 'Coupon id is required'),
    name: readRequiredString(item, 'name', 'Coupon name is required'),
    type,
    value: readCouponValue(item, type),
    status: readCouponStatus(item),
  };
}

function normalizeBatch(value: unknown): Batch {
  const item = readRequiredRecord(value, 'Coupon batch record is required');
  return {
    id: readRequiredString(item, 'id', 'Coupon batch id is required'),
    couponId: readRequiredString(item, 'couponId', 'Coupon id is required'),
    name: readRequiredString(item, 'name', 'Coupon batch name is required'),
    count: readRequiredNonNegativeNumber(item, 'count', 'Coupon batch count is required'),
    prefix: readRequiredString(item, 'prefix', 'Coupon batch prefix is required'),
    createdAt: readRequiredString(item, 'createdAt', 'Coupon batch created time is required'),
  };
}

function normalizePromoCode(value: unknown): PromoCode {
  const item = readRequiredRecord(value, 'Promo code record is required');
  return {
    id: readRequiredString(item, 'id', 'Promo code id is required'),
    batchId: readRequiredString(item, 'batchId', 'Coupon batch id is required'),
    code: readRequiredString(item, 'code', 'Promo code value is required'),
    status: readPromoStatus(item),
    usedBy: readString(item, 'usedBy') || undefined,
    usedAt: readString(item, 'usedAt') || undefined,
  };
}

function normalizeRedemptionRecord(value: unknown): RedemptionRecord {
  const item = readRequiredRecord(value, 'Redemption record is required');
  return {
    id: readRequiredString(item, 'id', 'Redemption record id is required'),
    userId: readRequiredString(item, 'userId', 'Redemption user id is required'),
    user: readRequiredString(item, 'user', 'Redemption user is required'),
    code: readRequiredString(item, 'code', 'Redemption code is required'),
    amount: readDisplayMoneyString(item, 'amount', 'Redemption amount is required', 'Redemption amount must be a money string'),
    time: readRequiredString(item, 'time', 'Redemption time is required'),
  };
}

function normalizeRechargeRecord(value: unknown): RechargeRecord {
  const item = readRequiredRecord(value, 'Recharge record is required');
  return {
    id: readRequiredString(item, 'id', 'Recharge record id is required'),
    tradeNo: readRequiredString(item, 'tradeNo', 'Recharge trade number is required'),
    userId: readRequiredString(item, 'userId', 'Recharge user id is required'),
    user: readRequiredString(item, 'user', 'Recharge user is required'),
    amount: readDisplayMoneyString(item, 'amount', 'Recharge amount is required', 'Recharge amount must be a money string'),
    usd_credited: readNonNegativeIntegerString(
      item,
      'usd_credited',
      'Recharge credited amount is required',
      'Recharge credited points must be a non-negative integer string',
    ),
    method: readRequiredString(item, 'method', 'Recharge method is required'),
    status: readRechargeStatus(item),
    time: readRequiredString(item, 'time', 'Recharge time is required'),
  };
}

function normalizeReferralStat(value: unknown): ReferralStat {
  const item = readRequiredRecord(value, 'Referral stat record is required');
  return {
    id: readRequiredString(item, 'id', 'Referral stat id is required'),
    inviter: readRequiredString(item, 'inviter', 'Referral inviter is required'),
    total_invited: readRequiredNumber(item, 'total_invited', 'Referral invited total is required'),
    total_revenue: readDisplayMoneyString(
      item,
      'total_revenue',
      'Referral revenue is required',
      'Referral revenue must be a money string',
    ),
    bonus_awarded: readDisplayMoneyString(item, 'bonus_awarded', 'Referral bonus is required', 'Referral bonus must be a money string'),
    link: readRequiredString(item, 'link', 'Referral link is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readCouponType(item: ApiRecord): Coupon['type'] {
  const type = readRequiredString(item, 'type', 'Coupon type is required');
  if (type === 'amount' || type === 'discount') {
    return type;
  }
  throw new Error(`Unsupported coupon type: ${type}`);
}

function readCouponStatus(item: ApiRecord): Coupon['status'] {
  const status = readRequiredString(item, 'status', 'Coupon status is required');
  if (status === 'active' || status === 'inactive') {
    return status;
  }
  throw new Error(`Unsupported coupon status: ${status}`);
}

function readCouponValue(item: ApiRecord, type: Coupon['type']): string {
  const value = readRequiredString(item, 'value', 'Coupon value is required');
  if (type === 'amount') {
    if (!isDisplayMoneyString(value)) {
      throw new Error('Coupon amount value must be a money string');
    }
    return value;
  }
  if (!isPercentageString(value)) {
    throw new Error('Coupon discount value must be a percentage string');
  }
  return value;
}

function readPromoStatus(item: ApiRecord): PromoCode['status'] {
  const status = readString(item, 'status');
  if (status === 'available' || status === 'claimed' || status === 'used' || status === 'voided') {
    return status;
  }
  throw new Error(status ? `Unsupported promo code status: ${status}` : 'Promo code status is required');
}

function promoCodeStatus(status: PromoCode['status']): AdminPromoCodeStatusUpdateRequest['status'] {
  if (status === 'available' || status === 'claimed' || status === 'used' || status === 'voided') {
    return status;
  }
  throw new Error(status ? `Unsupported promo code status: ${status}` : 'Promo code status is required');
}

function readRechargeStatus(item: ApiRecord): RechargeRecord['status'] {
  const status = readRequiredString(item, 'status', 'Recharge status is required');
  if (status === 'success' || status === 'pending' || status === 'failed' || status === 'closed') {
    return status;
  }
  throw new Error(`Unsupported recharge status: ${status}`);
}

function readDisplayMoneyString(item: ApiRecord, key: string, missingMessage: string, invalidMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!isDisplayMoneyString(value)) {
    throw new Error(invalidMessage);
  }
  return value;
}

function readNonNegativeIntegerString(
  item: ApiRecord,
  key: string,
  missingMessage: string,
  invalidMessage: string,
): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!/^\d+$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return value;
}

function isDisplayMoneyString(value: string): boolean {
  return /^\$?\d+(?:\.\d{1,2})?$/.test(value.trim());
}

function isPercentageString(value: string): boolean {
  const normalized = value.trim();
  const numeric = normalized.endsWith('%') ? normalized.slice(0, -1) : normalized;
  if (!/^\d+(?:\.\d{1,2})?$/.test(numeric)) {
    return false;
  }
  const amount = Number(numeric);
  return Number.isFinite(amount) && amount >= 0 && amount <= 100;
}
