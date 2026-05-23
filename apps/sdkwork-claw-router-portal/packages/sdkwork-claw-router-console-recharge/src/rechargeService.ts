import {
  getClawRouterAppSdkClient,
  readApiRecord,
  readRequiredApiItems,
  readString,
  createRequestToken,
  createRequestParams,
  isRecord,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface RechargePackage {
  id: string;
  rmb: string;
  bonus: number;
  points: number;
}

export class RechargeService {
  static async fetchPackages(): Promise<RechargePackage[]> {
    const result = await appRechargesPackagesList({ page: 1, pageSize: 100, status: 'active' });
    return readRequiredApiItems(result, 'console.recharge.errors.packagesFallback')
      .map(normalizeRechargePackage);
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
    createRequestParams('app-recharge-order-create'),
  );
}

export async function fetchRechargePackages(): Promise<RechargePackage[]> {
  return RechargeService.fetchPackages();
}

function createCommerceRequestNo(scope: string): string {
  return createRequestToken(scope);
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
