import {
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredNumber,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';

type BackendClient = ReturnType<typeof getClawRouterBackendSdkClient>;
type BackendSystem = BackendClient['system'];

export interface ReferralStat {
  id: string;
  inviter: string;
  total_invited: number;
  total_revenue: string;
  bonus_awarded: string;
  link: string;
}

export class MarketingService {
  static async fetchReferralStats(): Promise<ReferralStat[]> {
    const result = await getClawRouterBackendSdkClient().system.marketing.referralStats.list();
    return readRequiredApiItems(result, 'Failed to fetch referral stats')
      .map(normalizeReferralStat);
  }
}

export async function backendPromotionOffersList(
  params?: Parameters<BackendSystem['promotions']['offers']['management']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.offers.management.list(params);
  return readRequiredPromotionItems(result, 'Promotion offer records are required');
}

export async function backendPromotionCouponStocksList(
  params?: Parameters<BackendSystem['promotions']['couponStocks']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.couponStocks.list(params);
  return readRequiredPromotionItems(result, 'Promotion coupon stock records are required');
}

export async function backendPromotionCodesList(
  params?: Parameters<BackendSystem['promotions']['codes']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.codes.list(params);
  return readRequiredPromotionItems(result, 'Promotion code records are required');
}

export async function backendPromotionDiscountApplicationsList(
  params?: Parameters<BackendSystem['promotions']['discountApplications']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.discountApplications.list(params);
  return readRequiredPromotionItems(result, 'Promotion discount application records are required');
}

export async function backendPromotionDiscountAllocationsList(
  params?: Parameters<BackendSystem['promotions']['discountAllocations']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.discountAllocations.list(params);
  return readRequiredPromotionItems(result, 'Promotion discount allocation records are required');
}

export async function backendPromotionCodeRedemptionsList(
  params?: Parameters<BackendSystem['promotions']['codes']['redemptions']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.codes.redemptions.list(params);
  return readRequiredPromotionItems(result, 'Promotion code redemption records are required');
}

export async function backendPromotionUserCouponsList(
  params?: Parameters<BackendSystem['promotions']['userCoupons']['management']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.userCoupons.management.list(params);
  return readRequiredPromotionItems(result, 'Promotion user coupon records are required');
}

export async function backendPromotionCouponLedgerEntriesList(
  params?: Parameters<BackendSystem['promotions']['couponLedgerEntries']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.couponLedgerEntries.list(params);
  return readRequiredPromotionItems(result, 'Promotion coupon ledger records are required');
}

export async function backendPromotionBudgetLedgerEntriesList(
  params?: Parameters<BackendSystem['promotions']['budgetLedgerEntries']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.budgetLedgerEntries.list(params);
  return readRequiredPromotionItems(result, 'Promotion budget ledger records are required');
}

export async function backendPromotionExternalBindingsList(
  params?: Parameters<BackendSystem['promotions']['externalBindings']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.externalBindings.list(params);
  return readRequiredPromotionItems(result, 'Promotion external binding records are required');
}

export async function backendPromotionEventsList(
  params?: Parameters<BackendSystem['promotions']['events']['list']>[0],
) {
  const result = await getClawRouterBackendSdkClient().system.promotions.events.list(params);
  return readRequiredPromotionItems(result, 'Promotion event records are required');
}

function normalizeReferralStat(value: unknown): ReferralStat {
  const item = readRequiredRecord(value, 'Referral stat record is required');
  return {
    id: readRequiredString(item, 'id', 'Referral stat id is required'),
    inviter: readRequiredString(item, 'inviter', 'Referral inviter is required'),
    total_invited: readRequiredNumber(item, 'total_invited', 'Referral invited total is required'),
    total_revenue: readRequiredString(item, 'total_revenue', 'Referral revenue is required'),
    bonus_awarded: readRequiredString(item, 'bonus_awarded', 'Referral bonus is required'),
    link: readRequiredString(item, 'link', 'Referral link is required'),
  };
}

function readRequiredPromotionItems(result: unknown, message: string): ApiRecord[] {
  return readRequiredApiItems(result, message)
    .map((value) => {
      const item = readRequiredRecord(value, message);
      readRequiredString(item, 'id', 'Promotion record id is required');
      return item;
    });
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
