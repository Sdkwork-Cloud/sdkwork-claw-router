import {
  createRequestParams,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  BillingAccountPointsExchangesRulesListParams,
  BillingAccountPointsHistoryListParams,
  BillingAccountPointsRechargesRecordsListParams,
  BillingCouponsCatalogListParams,
  BillingVipPointsHistoryListParams,
  BillingWalletAccountsListParams,
  BillingWalletTransactionsListParams,
  CommerceCouponClaimRequest,
  CommerceCouponUsageRequest,
  CommerceCouponUsageRollbackRequest,
  CommerceEmptyCommandRequest,
  CommercePreflightRequest,
  CommerceRechargeOrderCancelRequest,
  CommerceVipPrivilegeSpeedUpRequest,
  CommerceVipPurchaseRequest,
  CommerceWalletCommandRequest,
} from '@sdkwork/clawrouter-app-sdk';

export interface PointsExchangeRate {
  sourceAssetType: 'POINTS';
  targetAssetType: 'CASH';
  rate: string;
}

export interface PointsExchangeRule extends PointsExchangeRate {
  id: string;
  status: 'active';
}

export class CommerceFoundationService {
  static async retrieveWalletOverview(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.overview.retrieve();
  }

  static async listWalletAccounts(params?: BillingWalletAccountsListParams): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.accounts.list(params);
  }

  static async listWalletTransactions(params?: BillingWalletTransactionsListParams): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.transactions.list(params);
  }

  static async retrieveWalletTransaction(transactionId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.transactions.retrieve(transactionId);
  }

  static async retrieveWalletOperation(requestNo: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.operations.retrieve(requestNo);
  }

  static async createWalletTopup(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.topups.create(
      body,
      createRequestParams('commerce-wallet-topup'),
    );
  }

  static async createWalletWithdrawal(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.withdrawals.create(
      body,
      createRequestParams('commerce-wallet-withdrawal'),
    );
  }

  static async createWalletTransfer(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.transfers.create(
      body,
      createRequestParams('commerce-wallet-transfer'),
    );
  }

  static async createWalletExchange(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.wallet.exchanges.create(
      body,
      createRequestParams('commerce-wallet-exchange'),
    );
  }

  static async retrieveAccountPoints(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.retrieve();
  }

  static async listAccountPointsHistory(params?: BillingAccountPointsHistoryListParams): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.history.list(params);
  }

  static async retrieveAccountPointsExchangeRate(): Promise<PointsExchangeRate> {
    const result = await getClawRouterAppSdkClient().billing.account.points.exchangeRate.retrieve();
    ensurePlusApiSuccess(result, 'console.billing.errors.exchangeRateFallback');
    return normalizePointsExchangeRate(readApiRecord(result));
  }

  static async listAccountPointsRechargePackages(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.recharges.packages.list();
  }

  static async listAccountPointsRechargeRecords(params?: BillingAccountPointsRechargesRecordsListParams): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.recharges.records.list(params);
  }

  static async retrieveAccountPointsRechargeOrder(orderNo: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.recharges.orders.retrieve(orderNo);
  }

  static async cancelAccountPointsRechargeOrder(
    orderNo: string,
    body: CommerceRechargeOrderCancelRequest = {},
  ): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.recharges.orders.cancel(
      orderNo,
      body,
      createRequestParams('commerce-points-recharge-cancel'),
    );
  }

  static async createAccountPointsTransfer(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.transfers.create(
      body,
      createRequestParams('commerce-points-transfer'),
    );
  }

  static async listAccountPointsExchangeRules(params?: BillingAccountPointsExchangesRulesListParams): Promise<PointsExchangeRule[]> {
    const result = await getClawRouterAppSdkClient().billing.account.points.exchanges.rules.list(params);
    ensurePlusApiSuccess(result, 'console.billing.errors.exchangeRulesFallback');
    return readRequiredApiItems(result, 'console.billing.errors.exchangeRulesFallback')
      .map(normalizePointsExchangeRule);
  }

  static async createAccountPointsExchange(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.exchanges.create(
      body,
      createRequestParams('commerce-points-exchange'),
    );
  }

  static async retrieveAccountPointsExchange(exchangeNo: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.points.exchanges.retrieve(exchangeNo);
  }

  static async retrieveAccountTokens(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.tokens.retrieve();
  }

  static async createAccountTokenDeduction(body: CommerceWalletCommandRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.account.tokens.deductions.create(
      body,
      createRequestParams('commerce-token-deduction'),
    );
  }

  static async listCouponCatalog(params?: BillingCouponsCatalogListParams): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.coupons.catalog.list(params);
  }

  static async retrieveCouponCatalogItem(couponId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.coupons.catalog.retrieve(couponId);
  }

  static async createCouponClaim(body: CommerceCouponClaimRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.coupons.claims.create(
      body,
      createRequestParams('commerce-coupon-claim'),
    );
  }

  static async createCouponUsage(body: CommerceCouponUsageRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.coupons.usage.create(
      body,
      createRequestParams('commerce-coupon-usage'),
    );
  }

  static async createCouponUsageReversal(body: CommerceCouponUsageRollbackRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.coupons.usageReversals.create(
      body,
      createRequestParams('commerce-coupon-usage-reversal'),
    );
  }

  static async retrieveCurrentUserCoupon(userCouponId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.users.current.coupons.retrieve(userCouponId);
  }

  static async retrievePaymentRecord(paymentId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.payments.records.retrieve(paymentId);
  }

  static async retrieveVipInfo(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.info.retrieve();
  }

  static async listVipLevels(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.levels.list();
  }

  static async listVipBenefits(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.benefits.list();
  }

  static async retrieveVipStatus(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.status.retrieve();
  }

  static async listVipPackGroups(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.packGroups.list();
  }

  static async retrieveVipPackGroup(packGroupId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.packGroups.retrieve(packGroupId);
  }

  static async listVipPackGroupPacks(packGroupId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.packGroups.packs.list(packGroupId);
  }

  static async listVipPacks(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.packs.list();
  }

  static async retrieveVipPack(packId: string): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.packs.retrieve(packId);
  }

  static async createVipPurchase(body: CommerceVipPurchaseRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.purchase.create(
      body,
      createRequestParams('commerce-vip-purchase'),
    );
  }

  static async renewVipPurchase(body: CommerceVipPurchaseRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.purchase.renew(
      body,
      createRequestParams('commerce-vip-renew'),
    );
  }

  static async upgradeVipPurchase(body: CommerceVipPurchaseRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.purchase.upgrade(
      body,
      createRequestParams('commerce-vip-upgrade'),
    );
  }

  static async retrieveVipPointsBalance(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.points.balance.retrieve();
  }

  static async listVipPointsHistory(params?: BillingVipPointsHistoryListParams): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.points.history.list(params);
  }

  static async createVipDailyReward(body: CommerceEmptyCommandRequest = {}): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.points.dailyRewards.create(
      body,
      createRequestParams('commerce-vip-daily-reward'),
    );
  }

  static async retrieveVipDailyRewardStatus(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.points.dailyRewards.status.retrieve();
  }

  static async retrieveVipPrivilegeUsage(): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.privileges.usage.retrieve();
  }

  static async createVipPrivilegeSpeedUp(body: CommerceVipPrivilegeSpeedUpRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.vip.privileges.speedUps.create(
      body,
      createRequestParams('commerce-vip-privilege-speed-up'),
    );
  }

  static async createPreflightEstimate(body: CommercePreflightRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.preflight.estimates.create(body);
  }

  static async createPreflightPrecheck(body: CommercePreflightRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.preflight.prechecks.create(body);
  }

  static async createPreflightPrehold(body: CommercePreflightRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.preflight.preholds.create(
      body,
      createRequestParams('commerce-preflight-prehold'),
    );
  }

  static async createPreflightSettlement(body: CommercePreflightRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.preflight.settlements.create(
      body,
      createRequestParams('commerce-preflight-settlement'),
    );
  }

  static async createPreflightRelease(body: CommercePreflightRequest): Promise<unknown> {
    return getClawRouterAppSdkClient().billing.preflight.releases.create(
      body,
      createRequestParams('commerce-preflight-release'),
    );
  }
}

function normalizePointsExchangeRate(value: unknown): PointsExchangeRate {
  const item = readRequiredRecord(value, 'Exchange rate record is required');
  return {
    sourceAssetType: readExpectedExchangeAssetType(item, 'sourceAssetType', 'POINTS'),
    targetAssetType: readExpectedExchangeAssetType(item, 'targetAssetType', 'CASH'),
    rate: readDecimalRateString(item, 'rate', 'Exchange rate is required'),
  };
}

function normalizePointsExchangeRule(value: unknown): PointsExchangeRule {
  const item = readRequiredRecord(value, 'Exchange rule record is required');
  return {
    id: readRequiredString(item, 'id', 'Exchange rule id is required'),
    sourceAssetType: readExpectedExchangeAssetType(item, 'sourceAssetType', 'POINTS'),
    targetAssetType: readExpectedExchangeAssetType(item, 'targetAssetType', 'CASH'),
    rate: readDecimalRateString(item, 'rate', 'Exchange rule rate is required'),
    status: readExchangeRuleStatus(item),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readExchangeAssetType(item: ApiRecord, key: 'sourceAssetType' | 'targetAssetType'): 'POINTS' | 'CASH' {
  const value = readRequiredString(item, key, `${key} is required`).trim().toUpperCase();
  if (value === 'POINTS' || value === 'CASH') {
    return value;
  }
  throw new Error(`Unsupported exchange asset type: ${value}`);
}

function readExpectedExchangeAssetType<T extends 'POINTS' | 'CASH'>(
  item: ApiRecord,
  key: 'sourceAssetType' | 'targetAssetType',
  expected: T,
): T {
  const value = readExchangeAssetType(item, key);
  if (value !== expected) {
    throw new Error(`exchange ${key} must be ${expected}`);
  }
  return expected;
}

function readExchangeRuleStatus(item: ApiRecord): PointsExchangeRule['status'] {
  const status = readRequiredString(item, 'status', 'Exchange rule status is required').trim().toLowerCase();
  if (status === 'active' || status === 'enabled' || status === 'normal') {
    return 'active';
  }
  throw new Error(`Unsupported exchange rule status: ${status}`);
}

function readDecimalRateString(item: ApiRecord, key: string, missingMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  return decimalRateString(value);
}

function decimalRateString(value: string): string {
  const normalized = value.trim().replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,6})?$/.test(normalized)) {
    throw new Error('Exchange rate must be a positive decimal string');
  }
  const [wholeRaw, fractionRaw = ''] = normalized.split('.');
  const whole = Number(wholeRaw);
  if (!Number.isSafeInteger(whole) || whole < 1 || whole > 1_000_000) {
    throw new Error('Exchange rate must be between 1 and 1000000');
  }
  if (whole === 1_000_000 && /[1-9]/.test(fractionRaw)) {
    throw new Error('Exchange rate must be between 1 and 1000000');
  }
  const wholeText = wholeRaw.replace(/^0+(?=\d)/, '') || '0';
  const fraction = fractionRaw.replace(/0+$/, '');
  return fraction ? `${wholeText}.${fraction}` : wholeText;
}
