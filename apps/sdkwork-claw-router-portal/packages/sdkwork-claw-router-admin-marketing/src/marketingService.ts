import {
  createRequestParams,
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readBoolean,
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
  BillingExchangeRulesListParams,
  BillingPaymentsAttemptsListParams,
  CommerceExchangeRuleUpsertRequest,
  CommerceRechargePackageMutationRequest,
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

export interface RechargePackage {
  id: string;
  rmb: string;
  bonus: number;
  points: number;
  status: 'active' | 'inactive';
}

export interface ExchangeRule {
  id: string;
  sourceAssetType: 'POINTS';
  targetAssetType: 'CASH';
  rate: string;
  status: 'active';
}

export interface PaymentAttempt {
  id: string;
  orderNo: string;
  provider: string;
  amount: string;
  status: 'pending' | 'success' | 'failed' | 'expired';
  createdAt: string;
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
    const result = await getClawRouterBackendSdkClient().billing.coupons.list();
    ensurePlusApiSuccess(result, 'Failed to fetch coupons');
    return readRequiredApiItems(result, 'Failed to fetch coupons')
      .map(normalizeCoupon);
  }

  static async fetchBatches(): Promise<Batch[]> {
    const result = await getClawRouterBackendSdkClient().billing.couponBatches.list();
    ensurePlusApiSuccess(result, 'Failed to fetch coupon batches');
    return readRequiredApiItems(result, 'Failed to fetch coupon batches')
      .map(normalizeBatch);
  }

  static async fetchPromoCodes(): Promise<PromoCode[]> {
    const result = await getClawRouterBackendSdkClient().billing.couponCodes.list();
    ensurePlusApiSuccess(result, 'Failed to fetch promo codes');
    return readRequiredApiItems(result, 'Failed to fetch promo codes')
      .map(normalizePromoCode);
  }

  static async fetchRedemptionRecords(): Promise<RedemptionRecord[]> {
    const result = await getClawRouterBackendSdkClient().billing.users.coupons.list();
    ensurePlusApiSuccess(result, 'Failed to fetch redemption records');
    return readRequiredApiItems(result, 'Failed to fetch redemption records')
      .map(normalizeRedemptionRecord);
  }

  static async fetchRechargeRecords(): Promise<RechargeRecord[]> {
    const result = await getClawRouterBackendSdkClient().billing.recharges.records.list();
    ensurePlusApiSuccess(result, 'Failed to fetch recharge records');
    return readRequiredApiItems(result, 'Failed to fetch recharge records')
      .map(normalizeRechargeRecord);
  }

  static async fetchReferralStats(): Promise<ReferralStat[]> {
    const result = await getClawRouterBackendSdkClient().billing.referrals.stats.list();
    ensurePlusApiSuccess(result, 'Failed to fetch referral stats');
    return readRequiredApiItems(result, 'Failed to fetch referral stats')
      .map(normalizeReferralStat);
  }

  static async addCoupon(coupon: CouponCreateInput): Promise<Coupon> {
    const result = await getClawRouterBackendSdkClient().billing.coupons.create(
      toCreateCouponRequest(coupon),
      createRequestParams('admin-coupon-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to add coupon');
    return normalizeCoupon(readRequiredApiItem(result, 'Created coupon response is missing data'));
  }

  static async deleteCoupon(id: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().billing.coupons.delete(requiredSafePathSegment(id, 'couponId'));
    ensureDeleteResult(result, 'Coupon delete confirmation is required');
    return true;
  }

  static async generateBatch(batch: CouponBatchGenerateInput): Promise<{ batch: Batch; codes: PromoCode[] }> {
    const result = await getClawRouterBackendSdkClient().billing.couponBatches.create(
      toGenerateBatchRequest(batch),
      createRequestParams('admin-coupon-batch-generate'),
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
    const result = await getClawRouterBackendSdkClient().billing.couponCodes.status.update(
      requiredSafePathSegment(id, 'codeId'),
      toUpdatePromoCodeStatusRequest(status),
      createRequestParams('admin-promo-code-status-update'),
    );
    ensureUpdatedResult(result, 'Promo code status update confirmation is required');
    return true;
  }

  static async updateCoupon(id: string, coupon: CouponCreateInput): Promise<Coupon> {
    const result = await getClawRouterBackendSdkClient().billing.coupons.update(
      requiredSafePathSegment(id, 'couponId'),
      toCreateCouponRequest(coupon),
      createRequestParams('admin-coupon-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update coupon');
    return normalizeCoupon(readRequiredApiItem(result, 'Updated coupon response is missing data'));
  }

  static async retrieveRechargeRecord(orderNo: string): Promise<unknown> {
    const result = await getClawRouterBackendSdkClient().billing.recharges.records.retrieve(
      requiredSafePathSegment(orderNo, 'orderNo'),
    );
    ensurePlusApiSuccess(result, 'Failed to fetch recharge record');
    return readApiRecord(result);
  }

  static async listRechargePackages(): Promise<RechargePackage[]> {
    const result = await getClawRouterBackendSdkClient().billing.recharges.packages.list();
    ensurePlusApiSuccess(result, 'Failed to fetch recharge packages');
    return readRequiredApiItems(result, 'Failed to fetch recharge packages')
      .map(normalizeRechargePackage);
  }

  static async createRechargePackage(body: CommerceRechargePackageMutationRequest): Promise<RechargePackage> {
    const result = await getClawRouterBackendSdkClient().billing.recharges.packages.create(
      toRechargePackageMutationRequest(body),
      createRequestParams('admin-recharge-package-create'),
    );
    ensurePlusApiSuccess(result, 'Failed to create recharge package');
    return normalizeRechargePackage(readRequiredApiItem(result, 'Created recharge package response is missing data', ['item']));
  }

  static async updateRechargePackage(packageId: string, body: CommerceRechargePackageMutationRequest): Promise<RechargePackage> {
    const result = await getClawRouterBackendSdkClient().billing.recharges.packages.update(
      requiredSafePathSegment(packageId, 'packageId'),
      toRechargePackageMutationRequest(body),
      createRequestParams('admin-recharge-package-update'),
    );
    ensurePlusApiSuccess(result, 'Failed to update recharge package');
    return normalizeRechargePackage(readRequiredApiItem(result, 'Updated recharge package response is missing data', ['item']));
  }

  static async deleteRechargePackage(packageId: string): Promise<boolean> {
    const result = await getClawRouterBackendSdkClient().billing.recharges.packages.delete(
      requiredSafePathSegment(packageId, 'packageId'),
    );
    ensureDeleteResult(result, 'Recharge package delete confirmation is required');
    return true;
  }

  static async listExchangeRules(params?: BillingExchangeRulesListParams): Promise<ExchangeRule[]> {
    const result = await getClawRouterBackendSdkClient().billing.exchangeRules.list(params);
    ensurePlusApiSuccess(result, 'Failed to fetch exchange rules');
    return readRequiredApiItems(result, 'Failed to fetch exchange rules')
      .map(normalizeExchangeRule);
  }

  static async upsertExchangeRule(body: CommerceExchangeRuleUpsertRequest): Promise<ExchangeRule> {
    const result = await getClawRouterBackendSdkClient().billing.exchangeRules.update(
      toExchangeRuleUpsertRequest(body),
      createRequestParams('admin-exchange-rule-upsert'),
    );
    ensurePlusApiSuccess(result, 'Failed to upsert exchange rule');
    return normalizeExchangeRule(readRequiredApiItem(result, 'Updated exchange rule response is missing data', ['item']));
  }

  static async listPaymentAttempts(params?: BillingPaymentsAttemptsListParams): Promise<PaymentAttempt[]> {
    const result = await getClawRouterBackendSdkClient().billing.payments.attempts.list(params);
    ensurePlusApiSuccess(result, 'Failed to fetch payment attempts');
    return readRequiredApiItems(result, 'Failed to fetch payment attempts')
      .map(normalizePaymentAttempt);
  }
}

function toCreateCouponRequest(coupon: CouponCreateInput): AdminCouponCreateRequest {
  return {
    name: requiredText(coupon.name, 'name'),
    type: couponType(coupon.type),
    value: requiredText(coupon.value, 'value'),
  };
}

function ensureDeleteResult(result: unknown, message: string): void {
  ensurePlusApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'deleted') !== true) {
    throw new Error(message);
  }
}

function ensureUpdatedResult(result: unknown, message: string): void {
  ensurePlusApiSuccess(result, message);
  if (readBoolean(readApiRecord(result), 'updated') !== true) {
    throw new Error(message);
  }
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

function toRechargePackageMutationRequest(
  value: CommerceRechargePackageMutationRequest,
): CommerceRechargePackageMutationRequest {
  const record = readRequiredRecord(value, 'Recharge package request is required');
  const request: CommerceRechargePackageMutationRequest = {
    rmb: moneyAmount(readRequiredString(record, 'rmb', 'rmb is required'), 'rmb'),
    bonus: nonNegativeIntegerInput(record.bonus, 'bonus'),
  };
  if (record.status !== undefined && record.status !== null && readString(record, 'status').trim()) {
    request.status = rechargePackageStatusInput(record.status);
  }
  return request;
}

function toExchangeRuleUpsertRequest(
  value: CommerceExchangeRuleUpsertRequest,
): CommerceExchangeRuleUpsertRequest {
  const record = readRequiredRecord(value, 'Exchange rule request is required');
  const request: CommerceExchangeRuleUpsertRequest = {
    sourceAssetType: exchangeRuleAssetType(readRequiredString(record, 'sourceAssetType', 'sourceAssetType is required')),
    targetAssetType: exchangeRuleAssetType(readRequiredString(record, 'targetAssetType', 'targetAssetType is required')),
    rate: decimalRateInput(record.rate, 'rate'),
  };
  if (request.sourceAssetType !== 'POINTS' || request.targetAssetType !== 'CASH') {
    throw new Error('exchange rule currently supports POINTS to CASH only');
  }
  if (record.status !== undefined && record.status !== null && readString(record, 'status').trim()) {
    request.status = exchangeRuleStatusInput(record.status);
  } else {
    request.status = 'active';
  }
  return request;
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

function normalizeRechargePackage(value: unknown): RechargePackage {
  const item = readRequiredRecord(value, 'Recharge package record is required');
  return {
    id: readRequiredString(item, 'id', 'Recharge package id is required'),
    rmb: readCanonicalMoneyString(
      item,
      'rmb',
      'Recharge package money amount is required',
      'Recharge package money amount must be a money string',
    ),
    bonus: readRequiredNonNegativeInteger(
      item,
      'bonus',
      'Recharge package bonus is required',
      'Recharge package bonus must be a non-negative integer',
    ),
    points: readRequiredNonNegativeInteger(
      item,
      'points',
      'Recharge package credited points are required',
      'Recharge package credited points must be a non-negative integer',
    ),
    status: readRechargePackageStatus(item),
  };
}

function normalizeExchangeRule(value: unknown): ExchangeRule {
  const item = readRequiredRecord(value, 'Exchange rule record is required');
  return {
    id: readRequiredString(item, 'id', 'Exchange rule id is required'),
    sourceAssetType: readExpectedExchangeRuleAssetType(item, 'sourceAssetType', 'POINTS'),
    targetAssetType: readExpectedExchangeRuleAssetType(item, 'targetAssetType', 'CASH'),
    rate: readDecimalRateString(item, 'rate', 'Exchange rule rate is required'),
    status: readExchangeRuleStatus(item),
  };
}

function normalizePaymentAttempt(value: unknown): PaymentAttempt {
  const item = readRequiredRecord(value, 'Payment attempt record is required');
  return {
    id: readRequiredString(item, 'id', 'Payment attempt id is required'),
    orderNo: readRequiredString(item, 'orderNo', 'Payment attempt order number is required'),
    provider: readRequiredString(item, 'provider', 'Payment attempt provider is required'),
    amount: readCanonicalMoneyString(
      item,
      'amount',
      'Payment attempt amount is required',
      'Payment attempt amount must be a money string',
    ),
    status: readPaymentAttemptStatus(item),
    createdAt: readRequiredString(item, 'createdAt', 'Payment attempt created time is required'),
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

function readRechargePackageStatus(item: ApiRecord): RechargePackage['status'] {
  const rawStatus = readString(item, 'status').trim().toLowerCase();
  if (!rawStatus) {
    return 'active';
  }
  if (rawStatus === 'active' || rawStatus === 'enabled' || rawStatus === 'normal') {
    return 'active';
  }
  if (rawStatus === 'inactive' || rawStatus === 'disabled') {
    return 'inactive';
  }
  throw new Error(`Unsupported recharge package status: ${rawStatus}`);
}

function readExpectedExchangeRuleAssetType<T extends 'POINTS' | 'CASH'>(
  item: ApiRecord,
  key: 'sourceAssetType' | 'targetAssetType',
  expected: T,
): T {
  const value = exchangeRuleAssetType(readRequiredString(item, key, `${key} is required`));
  if (value !== expected) {
    throw new Error(`exchange rule ${key} must be ${expected}`);
  }
  return expected;
}

function exchangeRuleAssetType(value: string): 'POINTS' | 'CASH' {
  const normalized = value.trim().toUpperCase();
  if (normalized === 'POINTS' || normalized === 'CASH') {
    return normalized;
  }
  throw new Error(`Unsupported exchange rule asset type: ${value}`);
}

function readExchangeRuleStatus(item: ApiRecord): ExchangeRule['status'] {
  const status = readRequiredString(item, 'status', 'Exchange rule status is required').trim().toLowerCase();
  if (status === 'active' || status === 'enabled' || status === 'normal') {
    return 'active';
  }
  throw new Error(`Unsupported exchange rule status: ${status}`);
}

function exchangeRuleStatusInput(value: unknown): CommerceExchangeRuleUpsertRequest['status'] {
  const status = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (status === 'active' || status === 'enabled' || status === 'normal') {
    return 'active';
  }
  if (status === 'inactive' || status === 'disabled') {
    throw new Error('exchange rule status only supports active');
  }
  throw new Error('exchange rule status must be active');
}

function readPaymentAttemptStatus(item: ApiRecord): PaymentAttempt['status'] {
  const status = readRequiredString(item, 'status', 'Payment attempt status is required').trim().toLowerCase();
  if (status === 'pending' || status === 'success' || status === 'failed' || status === 'expired') {
    return status;
  }
  throw new Error(`Unsupported payment attempt status: ${status}`);
}

function rechargePackageStatusInput(value: unknown): CommerceRechargePackageMutationRequest['status'] {
  const status = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (status === 'active' || status === 'inactive') {
    return status;
  }
  throw new Error('status must be active or inactive');
}

function readDisplayMoneyString(item: ApiRecord, key: string, missingMessage: string, invalidMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!isDisplayMoneyString(value)) {
    throw new Error(invalidMessage);
  }
  return value;
}

function readCanonicalMoneyString(item: ApiRecord, key: string, missingMessage: string, invalidMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!isCanonicalMoneyString(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
}

function readDecimalRateString(item: ApiRecord, key: string, missingMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  return decimalRateString(value);
}

function readRequiredNonNegativeInteger(
  item: ApiRecord,
  key: string,
  missingMessage: string,
  invalidMessage: string,
): number {
  const value = item[key];
  const numberValue = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
  if (typeof numberValue !== 'number' || !Number.isFinite(numberValue)) {
    throw new Error(missingMessage);
  }
  if (!Number.isSafeInteger(numberValue) || numberValue < 0) {
    throw new Error(invalidMessage);
  }
  return numberValue;
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

function moneyAmount(value: string, fieldName: string): string {
  const normalized = value.trim().replace(/,/g, '');
  if (!isCanonicalMoneyString(normalized)) {
    throw new Error(`${fieldName} must be a positive money amount`);
  }
  if (!/[1-9]/.test(normalized.replace('.', ''))) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return formatMoneyString(normalized);
}

function nonNegativeIntegerInput(value: unknown, fieldName: string): number {
  const textValue = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : '';
  if (!/^\d+$/.test(textValue)) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  const numberValue = Number(textValue);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return numberValue;
}

function isCanonicalMoneyString(value: string): boolean {
  return /^\d+(?:\.\d{1,2})?$/.test(value.trim());
}

function decimalRateInput(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(`${fieldName} must be a positive decimal string`);
  }
  return decimalRateString(String(value));
}

function decimalRateString(value: string): string {
  const normalized = value.trim().replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,6})?$/.test(normalized)) {
    throw new Error('Exchange rule rate must be a positive decimal string');
  }
  const [wholeRaw, fractionRaw = ''] = normalized.split('.');
  const whole = Number(wholeRaw);
  if (!Number.isSafeInteger(whole) || whole < 1 || whole > 1_000_000) {
    throw new Error('Exchange rule rate must be between 1 and 1000000');
  }
  if (whole === 1_000_000 && /[1-9]/.test(fractionRaw)) {
    throw new Error('Exchange rule rate must be between 1 and 1000000');
  }
  const wholeText = wholeRaw.replace(/^0+(?=\d)/, '') || '0';
  const fraction = fractionRaw.replace(/0+$/, '');
  return fraction ? `${wholeText}.${fraction}` : wholeText;
}

function formatMoneyString(value: string): string {
  const [whole, fraction = ''] = value.trim().split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
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
