import {
  createClientOperationToken,
  createIdempotencyParams,
  isRecord,
  normalizeRechargeSettings,
  readApiRecord,
  readRequiredApiItem,
  readRequiredApiItems,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

export interface RechargePackage {
  id: string;
  priceAmount: string;
  currencyCode: string;
  bonusPoints: number;
  grantAmount: number;
  points: number;
}

export type RechargeOrderNextAction = 'scan_qr' | 'request_payment' | 'open_url' | 'completed' | 'pending';

export interface RechargeOrderCreateResult {
  success: boolean;
  orderNo: string;
  providerCode?: string;
  paymentMethod?: string;
  paymentProduct?: string;
  nextAction?: RechargeOrderNextAction;
  cashierUrl?: string;
  qrCodePayload?: string;
  requestPaymentPayload?: string | null;
}

export interface RechargeSettingsSnapshot {
  baseCurrencyCode: string;
  basePointsPerCny: string;
  currencyToCnyRates: Record<string, string>;
  previewExamples?: Record<string, Record<string, { grantAmount: number }>>;
}

export type BillingHistoryType = 'redeem' | 'recharge';
export type BillingHistoryTab = 'all' | BillingHistoryType;

export interface BillingHistoryItem {
  id: string;
  historyNo: string;
  type: BillingHistoryType;
  direction: string;
  assetType: string;
  amount: string;
  currencyCode?: string;
  pointsDelta: number;
  status: string;
  title: string;
  method: string;
  referenceNo?: string;
  sourceType?: string;
  sourceId?: string;
  relatedOrderNo?: string;
  paymentMethod?: string;
  occurredAt: string;
}

export class RechargeService {
  static async fetchPackages(): Promise<RechargePackage[]> {
    const result = await appRechargesPackagesList({ page: '1', pageSize: '100', status: 'active' });
    return readRequiredApiItems(result, 'console.recharge.errors.packagesFallback')
      .map(normalizeRechargePackage);
  }

  static async fetchRechargeSettings(): Promise<RechargeSettingsSnapshot> {
    const result = await appRechargesSettingsRetrieve();
    return normalizeRechargeSettings(
      readRequiredApiItem(result, 'console.recharge.errors.exchangeRulesFallback'),
    );
  }

  static async fetchBillingHistory(params: { type?: BillingHistoryType } = {}): Promise<BillingHistoryItem[]> {
    const result = await appBillingHistoryList({
      page: '1',
      pageSize: '100',
      ...(params.type ? { type: params.type } : {}),
    });
    const missingIdMessage = params.type === 'recharge'
      ? 'Recharge history id is required'
      : params.type === 'redeem'
        ? 'Redeem history id is required'
        : 'Billing history id is required';
    return readRequiredApiItems(result, 'console.recharge.records.errors.loadFallback')
      .map((item) => normalizeBillingHistoryItem(item, missingIdMessage));
  }

  static async submitRecharge(
    amount: string,
    currencyCode: string,
    packageId?: string,
  ): Promise<RechargeOrderCreateResult> {
    const result = await appRechargesOrdersCreate({
      amount: moneyAmount(amount, 'amount'),
      clientRequestNo: createCommerceRequestNo('recharge'),
      currencyCode: requiredCurrencyCode(currencyCode),
      ...(packageId ? { packageId: requiredText(packageId, 'packageId') } : {}),
      source: 'console-recharge',
    });
    const data = readApiRecord(result);
    const success = readRequiredBoolean(data, 'success', 'Recharge success flag is required');
    if (!success) {
      throw new Error('Recharge submission was not accepted');
    }
    const orderNo =
      readString(data, 'orderNo') ||
      readString(data, 'orderId') ||
      readString(data, 'requestNo');
    if (!orderNo) {
      throw new Error('Recharge order number is required');
    }
    const requestPaymentPayload = readRechargeRequestPaymentPayload(data);
    return {
      success,
      orderNo,
      ...(readFirstOptionalString(data, ['providerCode', 'provider_code']) ? {
        providerCode: readFirstOptionalString(data, ['providerCode', 'provider_code']),
      } : {}),
      ...(readFirstOptionalString(data, ['paymentMethod', 'payment_method']) ? {
        paymentMethod: readFirstOptionalString(data, ['paymentMethod', 'payment_method']),
      } : {}),
      ...(readFirstOptionalString(data, ['paymentProduct', 'payment_product']) ? {
        paymentProduct: readFirstOptionalString(data, ['paymentProduct', 'payment_product']),
      } : {}),
      ...(readFirstOptionalString(data, ['nextAction', 'next_action']) ? {
        nextAction: readNextActionValue(readFirstOptionalString(data, ['nextAction', 'next_action']) ?? ''),
      } : {}),
      ...(readFirstOptionalString(data, ['cashierUrl', 'cashier_url']) ? {
        cashierUrl: readFirstOptionalString(data, ['cashierUrl', 'cashier_url']),
      } : {}),
      ...(readFirstOptionalString(data, ['qrCodePayload', 'qr_code_payload']) ? {
        qrCodePayload: readFirstOptionalString(data, ['qrCodePayload', 'qr_code_payload']),
      } : {}),
      ...(requestPaymentPayload !== undefined ? { requestPaymentPayload } : {}),
    };
  }
}

type AppCommerceService = ReturnType<typeof getSdkworkCommerceService>;

export async function listCatalogCategories(params?: Parameters<AppCommerceService['catalog']['categories']['list']>[0]) {
  return getSdkworkCommerceService().catalog.categories.list(params);
}

export async function listCatalogProducts(params?: Parameters<AppCommerceService['catalog']['products']['list']>[0]) {
  return getSdkworkCommerceService().catalog.products.list(params);
}

export async function retrieveCatalogProduct(productId: string) {
  return getSdkworkCommerceService().catalog.products.retrieve(productId);
}

export async function retrieveCatalogSku(skuId: string) {
  return getSdkworkCommerceService().catalog.skus.retrieve(skuId);
}

export async function appRechargesPackagesList(params?: Parameters<AppCommerceService['recharges']['packages']['list']>[0]) {
  return getSdkworkCommerceService().recharges.packages.list(params);
}

export async function appRechargesSettingsRetrieve() {
  return getSdkworkCommerceService().recharges.settings.retrieve();
}

export async function appRechargesOrdersCreate(body: Parameters<AppCommerceService['recharges']['orders']['create']>[0]) {
  return getSdkworkCommerceService().recharges.orders.create(
    body,
    createIdempotencyParams('app-recharge-order-create'),
  );
}

type BillingHistorySdkParams = Parameters<AppCommerceService['billing']['history']['list']>[0];

export async function appBillingHistoryList(params?: BillingHistorySdkParams & { type?: BillingHistoryType }) {
  const { type, ...rest } = params ?? {};
  return getSdkworkCommerceService().billing.history.list({
    ...rest,
    ...(type ? { type_: type } : {}),
  });
}

export async function fetchRechargePackages(): Promise<RechargePackage[]> {
  return RechargeService.fetchPackages();
}

export async function fetchRechargeSettings(): Promise<RechargeSettingsSnapshot> {
  return RechargeService.fetchRechargeSettings();
}

function createCommerceRequestNo(scope: string): string {
  return createClientOperationToken(scope);
}

function normalizeRechargePackage(value: unknown): RechargePackage {
  const item = readRequiredRecord(value, 'Recharge package record is required');
  return {
    id: firstRequiredString(item, ['id', 'packageNo', 'package_no'], 'Recharge package id is required'),
    priceAmount: firstMoneyString(
      item,
      ['priceAmount', 'price_amount'],
      'Recharge package money amount is required',
      'Recharge package money amount must be a money string',
    ),
    currencyCode: requiredCurrencyCode(
      readFirstOptionalString(item, ['currencyCode', 'currency_code']) || 'CNY',
    ),
    bonusPoints: readOptionalNonNegativeNumber(item, ['bonusPoints', 'bonus_points']),
    grantAmount: readOptionalNonNegativeNumber(item, ['grantAmount', 'grant_amount', 'points']),
    points: readOptionalNonNegativeNumber(item, ['points', 'grantAmount', 'grant_amount']),
  };
}

function normalizeBillingHistoryItem(value: unknown, missingIdMessage: string): BillingHistoryItem {
  const item = readRequiredRecord(value, 'Billing history record is required');
  const type = firstRequiredString(item, ['type', 'historyType', 'history_type'], 'Billing history type is required');
  if (type !== 'redeem' && type !== 'recharge') {
    throw new Error(`Unsupported billing history type: ${type}`);
  }
  const paymentMethod = readFirstOptionalString(item, ['paymentMethod', 'payment_method']);
  const sourceType = readFirstOptionalString(item, ['sourceType', 'source_type']);
  const method = paymentMethod || sourceType || 'billing';
  return {
    id: firstRequiredString(item, ['id'], missingIdMessage),
    historyNo: firstRequiredString(item, ['historyNo', 'history_no'], 'Billing history number is required'),
    type,
    direction: readFirstOptionalString(item, ['direction']) || 'credit',
    assetType: readFirstOptionalString(item, ['assetType', 'asset_type']) || 'points',
    amount: firstBillingMoneyString(item, ['amount'], 'Billing history amount is required', 'Billing history amount must be a money string'),
    currencyCode: readFirstOptionalString(item, ['currencyCode', 'currency_code']),
    pointsDelta: firstOptionalNumber(item, ['pointsDelta', 'points_delta']) ?? 0,
    status: firstRequiredString(item, ['status'], 'Billing history status is required'),
    title: readFirstOptionalString(item, ['title']) || (type === 'recharge' ? 'Recharge' : 'Redeem'),
    referenceNo: readFirstOptionalString(item, ['referenceNo', 'reference_no']),
    method: requiredText(method, 'method'),
    sourceType,
    sourceId: readFirstOptionalString(item, ['sourceId', 'source_id']),
    relatedOrderNo: readFirstOptionalString(item, ['relatedOrderNo', 'related_order_no']),
    paymentMethod,
    occurredAt: firstRequiredString(item, ['occurredAt', 'occurred_at', 'createdAt', 'created_at'], 'Billing history occurrence time is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function requiredCurrencyCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!normalized) {
    throw new Error('currencyCode is required');
  }
  if (!/^[A-Z0-9_-]{3,16}$/.test(normalized)) {
    throw new Error('currencyCode is invalid');
  }
  return normalized;
}

function readRequiredBoolean(record: ApiRecord, key: string, message: string): boolean {
  const value = record[key];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  throw new Error(message);
}

function firstRequiredString(item: ApiRecord, keys: readonly string[], message: string): string {
  const value = readFirstString(item, keys);
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function readFirstString(item: ApiRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const value = readString(item, key).trim();
    if (value) {
      return value;
    }
  }
  return '';
}

function readFirstOptionalString(item: ApiRecord, keys: readonly string[]): string | undefined {
  const value = readFirstString(item, keys);
  return value || undefined;
}

function readNextActionValue(value: string): RechargeOrderNextAction {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'request_payment') {
    return 'request_payment';
  }
  if (normalized === 'open_url' || normalized === 'redirect') {
    return 'open_url';
  }
  if (normalized === 'completed' || normalized === 'success') {
    return 'completed';
  }
  if (normalized === 'pending') {
    return 'pending';
  }
  return 'scan_qr';
}

function readRechargeRequestPaymentPayload(item: ApiRecord): string | null | undefined {
  const hasCamelCase = Object.prototype.hasOwnProperty.call(item, 'requestPaymentPayload');
  const hasSnakeCase = Object.prototype.hasOwnProperty.call(item, 'request_payment_payload');
  if (!hasCamelCase && !hasSnakeCase) {
    return undefined;
  }
  const value = hasCamelCase ? item.requestPaymentPayload : item.request_payment_payload;
  if (value === null || value === '') {
    return null;
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function firstOptionalNumber(item: ApiRecord, keys: readonly string[]): number | undefined {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim()) {
      const number = Number(value.trim());
      if (Number.isFinite(number)) {
        return number;
      }
    }
  }
  return undefined;
}

function readOptionalNonNegativeNumber(item: ApiRecord, keys: readonly string[]): number {
  const value = firstOptionalNumber(item, keys);
  if (value === undefined) {
    return 0;
  }
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${keys[0]} must be a non-negative number`);
  }
  return value;
}

function firstBillingMoneyString(
  item: ApiRecord,
  keys: readonly string[],
  missingMessage: string,
  invalidMessage: string,
): string {
  const value = readFirstString(item, keys);
  if (!value) {
    throw new Error(missingMessage);
  }
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatSignedMoneyString(value);
}

function firstMoneyString(
  item: ApiRecord,
  keys: readonly string[],
  missingMessage: string,
  invalidMessage: string,
): string {
  const value = readFirstString(item, keys);
  if (!value) {
    throw new Error(missingMessage);
  }
  return moneyAmount(value, invalidMessage);
}

function moneyAmount(value: string, fieldName: string): string {
  const normalized = requiredText(value, fieldName).replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive money amount`);
  }
  if (!/[1-9]/.test(normalized.replace('.', ''))) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return formatMoneyString(normalized);
}

function formatMoneyString(value: string): string {
  const [whole, fraction = ''] = value.split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

function formatSignedMoneyString(value: string): string {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;
  const [whole, fraction = ''] = unsigned.split('.');
  return `${sign}${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
