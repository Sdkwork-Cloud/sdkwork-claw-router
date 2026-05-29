import {
  getClawRouterAppSdkClient,
  readApiRecord,
  readRequiredApiItems,
  readString,
  createClientOperationToken,
  createIdempotencyParams,
  isRecord,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface RechargePackage {
  id: string;
  rmb: string;
  bonus: number;
  points: number;
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
  referenceNo?: string;
  sourceType?: string;
  sourceId?: string;
  relatedOrderNo?: string;
  paymentMethod?: string;
  occurredAt: string;
}

export class RechargeService {
  static async fetchPackages(): Promise<RechargePackage[]> {
    const result = await appRechargesPackagesList({ page: 1, pageSize: 100, status: 'active' });
    return readRequiredApiItems(result, 'console.recharge.errors.packagesFallback')
      .map(normalizeRechargePackage);
  }

  static async fetchBillingHistory(params: { type?: BillingHistoryType } = {}): Promise<BillingHistoryItem[]> {
    const result = await appBillingHistoryList({
      page: 1,
      pageSize: 100,
      ...(params.type ? { type: params.type } : {}),
    });
    const missingIdMessage = params.type === 'recharge'
      ? 'Recharge history id is required'
      : params.type === 'redeem'
        ? 'Redeem history id is required'
        : 'Billing history id is required';
    return readRequiredApiItems(result, 'console.recharge.records.errors.loadFallback')
      .map(item => normalizeBillingHistoryItem(item, missingIdMessage));
  }

  static async submitRecharge(
    amount: string,
    method: string,
    packageId?: string,
  ): Promise<{ success: boolean; orderNo: string }> {
    const result = await appRechargesOrdersCreate(
      {
        clientRequestNo: createCommerceRequestNo('recharge'),
        metadata: {
          amount: moneyAmount(amount, 'amount'),
          paymentMethod: requiredText(method, 'method'),
          ...(packageId ? { packageId: requiredText(packageId, 'packageId') } : {}),
          source: 'console-recharge',
        },
      },
    );
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
    return { success, orderNo };
  }
}

type AppCommerce = ReturnType<typeof getClawRouterAppSdkClient>['commerce'];

export async function listCatalogCategories(params?: Parameters<AppCommerce['catalog']['categories']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.catalog.categories.list(params);
}

export async function listCatalogProducts(params?: Parameters<AppCommerce['catalog']['products']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.catalog.products.list(params);
}

export async function retrieveCatalogProduct(productId: string) {
  return getClawRouterAppSdkClient().commerce.catalog.products.retrieve(productId);
}

export async function retrieveCatalogSku(skuId: string) {
  return getClawRouterAppSdkClient().commerce.catalog.skus.retrieve(skuId);
}

export async function appRechargesPackagesList(params?: Parameters<AppCommerce['recharges']['packages']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.recharges.packages.list(params);
}

export async function appRechargesOrdersCreate(body: Parameters<AppCommerce['recharges']['orders']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.recharges.orders.create(
    body,
    createIdempotencyParams('app-recharge-order-create'),
  );
}

type BillingHistorySdkParams = Parameters<AppCommerce['billing']['history']['list']>[0];

export async function appBillingHistoryList(params?: BillingHistorySdkParams & { type?: BillingHistoryType }) {
  const { type, ...rest } = params ?? {};
  return getClawRouterAppSdkClient().commerce.billing.history.list({
    ...rest,
    ...(type ? { type_: type } : {}),
  });
}

export async function fetchRechargePackages(): Promise<RechargePackage[]> {
  return RechargeService.fetchPackages();
}

function createCommerceRequestNo(scope: string): string {
  return createClientOperationToken(scope);
}

function normalizeRechargePackage(value: unknown): RechargePackage {
  const item = readRequiredRecord(value, 'Recharge package record is required');
  return {
    id: firstRequiredString(item, ['id', 'packageNo', 'package_no'], 'Recharge package id is required'),
    rmb: firstMoneyString(
      item,
      ['rmb', 'priceAmount', 'price_amount'],
      'Recharge package money amount is required',
      'Recharge package money amount must be a money string',
    ),
    bonus: readOptionalNonNegativeNumber(item, 'bonus'),
    points: readOptionalNonNegativeNumber(item, 'points'),
  };
}

function normalizeBillingHistoryItem(value: unknown, missingIdMessage: string): BillingHistoryItem {
  const item = readRequiredRecord(value, 'Billing history record is required');
  const type = firstRequiredString(item, ['type', 'historyType', 'history_type'], 'Billing history type is required');
  if (type !== 'redeem' && type !== 'recharge') {
    throw new Error(`Unsupported billing history type: ${type}`);
  }
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
    sourceType: readFirstOptionalString(item, ['sourceType', 'source_type']),
    sourceId: readFirstOptionalString(item, ['sourceId', 'source_id']),
    relatedOrderNo: readFirstOptionalString(item, ['relatedOrderNo', 'related_order_no']),
    paymentMethod: readFirstOptionalString(item, ['paymentMethod', 'payment_method']),
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

function readOptionalNonNegativeNumber(item: ApiRecord, key: string): number {
  const value = item[key];
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }
  return number;
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
