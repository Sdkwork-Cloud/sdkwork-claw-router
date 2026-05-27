import {
  getClawRouterAppSdkClient,
  createIdempotencyParams,
  createClientOperationToken,
  isRecord,
  readApiRecord,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import { RechargeService, type BillingHistoryItem } from 'sdkwork-claw-router-console-recharge';

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
    const history = await RechargeService.fetchBillingHistory({ type: 'redeem' });
    return history.map(normalizeRedeemHistoryItem);
  }

  static async fetchRechargeHistory(): Promise<RechargeHistoryItem[]> {
    const history = await RechargeService.fetchBillingHistory({ type: 'recharge' });
    return history.map(normalizeRechargeHistoryItem);
  }

  static async redeemCode(code: string): Promise<{ success: boolean; message: string; amount?: string }> {
    try {
      const normalizedCode = requiredText(code, 'code');
      const data = readRequiredRecord(
        readApiRecord(await appPromotionCodeRedemptionsCreate(
          {
            clientRequestNo: createClientOperationToken('promotion-code-redemption'),
            code: normalizedCode,
            source: 'console-wallet',
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
type AppSystem = ReturnType<typeof getClawRouterAppSdkClient>['system'];

export async function appPromotionUserCouponsList(params?: Parameters<AppSystem['promotions']['userCoupons']['wallet']['list']>[0]) {
  return getClawRouterAppSdkClient().system.promotions.userCoupons.wallet.list(params);
}

export async function appPromotionUserCouponClaimsCreate(
  body: Parameters<AppSystem['promotions']['userCoupons']['claims']['create']>[0],
) {
  return getClawRouterAppSdkClient().system.promotions.userCoupons.claims.create(
    body,
    createIdempotencyParams('app-promotion-user-coupon-claim-create'),
  );
}

export async function appPromotionCodeRedemptionsCreate(
  body: Parameters<AppSystem['promotions']['codes']['redemptions']['create']>[0],
) {
  return getClawRouterAppSdkClient().system.promotions.codes.redemptions.create(
    body,
    createIdempotencyParams('app-promotion-code-redemption-create'),
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

function normalizeRedeemHistoryItem(value: BillingHistoryItem): RedeemHistoryItem {
  const item = value as BillingHistoryItem & ApiRecord;
  return {
    id: readRequiredString(item, 'id', 'Redeem history id is required'),
    code: item.referenceNo || item.relatedOrderNo || item.sourceId || item.historyNo,
    amount: formatMoneyString(item.amount),
    date: item.occurredAt,
    status: readCommerceStatus(item.status),
  };
}

function normalizeRechargeHistoryItem(value: BillingHistoryItem): RechargeHistoryItem {
  const item = value as BillingHistoryItem & ApiRecord;
  return {
    id: readRequiredString(item, 'id', 'Recharge history id is required'),
    orderNo: item.relatedOrderNo || item.referenceNo || item.sourceId || item.historyNo,
    method: item.paymentMethod || item.sourceType || 'billing',
    amount: formatMoneyString(item.amount),
    date: item.occurredAt,
    status: readCommerceStatus(item.status),
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

function readCommerceStatus(value: string): 'success' | 'pending' | 'failed' {
  const status = value.trim().toLowerCase();
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

function formatMoneyString(value: string): string {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;
  const [whole, fraction = ''] = unsigned.split('.');
  return `${sign}${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
