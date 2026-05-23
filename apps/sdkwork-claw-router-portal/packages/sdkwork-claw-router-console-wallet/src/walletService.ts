import {
  getClawRouterAppSdkClient,
  createRequestParams,
  createRequestToken,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface CommerceHistoryItem {
  id: string;
  amount: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

export interface RedeemHistoryItem extends CommerceHistoryItem {
  code: string;
}

export interface RechargeHistoryItem extends CommerceHistoryItem {
  orderNo: string;
  method: string;
}

export class WalletService {
  static async fetchRedeemHistory(): Promise<RedeemHistoryItem[]> {
    const result = await appCouponsList({ page: 1, pageSize: 100, status: 'redeemed' });
    return readRequiredApiItems(result, 'console.billing.errors.redeemHistoryFallback')
      .map(normalizeRedeemHistoryItem);
  }

  static async fetchRechargeHistory(): Promise<RechargeHistoryItem[]> {
    const result = await appWalletLedgerEntriesList({ page: 1, pageSize: 100, status: 'posted' });
    return readRequiredApiItems(result, 'console.billing.errors.rechargeHistoryFallback')
      .map(normalizeRechargeHistoryItem);
  }

  static async redeemCode(code: string): Promise<{ success: boolean; message: string; amount?: string }> {
    try {
      const normalizedCode = requiredText(code, 'code');
      const data = readRequiredRecord(
        readApiRecord(await appCouponsRedemptionsCreate(
          {
            clientRequestNo: createRequestToken('coupon-redemption'),
            metadata: {
              code: normalizedCode,
              source: 'console-wallet',
            },
          },
        )),
        'console.billing.errors.redeemFallback',
      );
      const message = readString(data, 'msg') || readString(data, 'message') || 'Redeemed successfully';
      const amount = readOptionalMoneyString(data, 'amount', 'Redeem amount must be a money string');
      return {
        success: true,
        message,
        ...(amount === undefined ? {} : { amount }),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error && error.message.trim() ? error.message : 'console.billing.errors.redeemFallback',
      };
    }
  }
}

type AppCommerce = ReturnType<typeof getClawRouterAppSdkClient>['commerce'];

export async function appCouponsList(params?: Parameters<AppCommerce['coupons']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.coupons.list(params);
}

export async function appCouponsClaimsCreate(body: Parameters<AppCommerce['coupons']['claims']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.coupons.claims.create(body, createRequestParams('app-coupon-claim-create'));
}

export async function appCouponsRedemptionsCreate(body: Parameters<AppCommerce['coupons']['redemptions']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.coupons.redemptions.create(
    body,
    createRequestParams('app-coupon-redemption-create'),
  );
}

export async function appWalletAccountsList(params?: Parameters<AppCommerce['wallet']['accounts']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.wallet.accounts.list(params);
}

export async function appWalletOverviewRetrieve() {
  return getClawRouterAppSdkClient().commerce.wallet.overview.retrieve();
}

export async function appWalletTokensRetrieve() {
  return getClawRouterAppSdkClient().commerce.wallet.tokens.retrieve();
}

export async function appWalletExchangeRateRetrieve() {
  return getClawRouterAppSdkClient().commerce.wallet.exchangeRate.retrieve();
}

export async function appWalletPointsExchangeRulesList(params?: Parameters<AppCommerce['wallet']['points']['exchangeRules']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.wallet.points.exchangeRules.list(params);
}

export async function appWalletLedgerEntriesList(params?: Parameters<AppCommerce['wallet']['ledgerEntries']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.wallet.ledgerEntries.list(params);
}

export async function appWalletLedgerEntriesRetrieve(ledgerEntryId: string) {
  return getClawRouterAppSdkClient().commerce.wallet.ledgerEntries.retrieve(ledgerEntryId);
}

function normalizeRedeemHistoryItem(value: unknown): RedeemHistoryItem {
  const item = readRequiredRecord(value, 'Redeem history record is required');
  return {
    id: firstRequiredString(item, ['id', 'couponId', 'coupon_id', 'redemptionNo', 'redemption_no'], 'Redeem history id is required'),
    code: firstRequiredString(item, ['code', 'couponCode', 'coupon_code', 'templateCode', 'template_code'], 'Redeem history code is required'),
    amount: readFirstMoneyString(
      item,
      ['amount', 'discountAmount', 'discount_amount'],
      'Redeem history amount is required',
      'Redeem history amount must be a money string',
    ),
    date: firstRequiredString(item, ['date', 'redeemedAt', 'redeemed_at', 'createdAt', 'created_at'], 'Redeem history date is required'),
    status: readCommerceStatus(item, 'Redeem history status is required'),
  };
}

function normalizeRechargeHistoryItem(value: unknown): RechargeHistoryItem {
  const item = readRequiredRecord(value, 'Recharge history record is required');
  return {
    id: firstRequiredString(item, ['id', 'transactionNo', 'transaction_no', 'requestNo', 'request_no'], 'Recharge history id is required'),
    orderNo: firstRequiredString(item, ['orderNo', 'order_no', 'sourceId', 'source_id', 'requestNo', 'request_no'], 'Recharge history order number is required'),
    method: readFirstString(item, ['method', 'paymentMethod', 'payment_method', 'sourceType', 'source_type']) || 'wallet',
    amount: readFirstMoneyString(
      item,
      ['amount'],
      'Recharge history amount is required',
      'Recharge history amount must be a money string',
    ),
    date: firstRequiredString(item, ['date', 'createdAt', 'created_at'], 'Recharge history date is required'),
    status: readCommerceStatus(item, 'Recharge history status is required'),
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

function readCommerceStatus(item: ApiRecord, missingMessage: string): 'success' | 'pending' | 'failed' {
  const status = firstRequiredString(item, ['status', 'state'], missingMessage).toLowerCase();
  if (status === 'success' || status === 'succeeded' || status === 'posted' || status === 'redeemed') {
    return 'success';
  }
  if (status === 'pending' || status === 'processing' || status === 'created') {
    return 'pending';
  }
  if (status === 'failed' || status === 'closed' || status === 'cancelled' || status === 'canceled') {
    return 'failed';
  }
  throw new Error(`Unsupported billing status: ${status}`);
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

function readOptionalMoneyString(item: ApiRecord, key: string, invalidMessage: string): string | undefined {
  if (!(key in item)) {
    return undefined;
  }
  const value = readString(item, key).trim();
  if (!value) {
    return undefined;
  }
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
}

function readFirstMoneyString(
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
  return formatMoneyString(value);
}

function formatMoneyString(value: string): string {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;
  const [whole, fraction = ''] = unsigned.split('.');
  return `${sign}${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
