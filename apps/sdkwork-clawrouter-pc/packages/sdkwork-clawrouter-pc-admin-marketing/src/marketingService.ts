import {
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredNumber,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type CommerceRequestParams = Record<string, unknown>;

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
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.offers.management.list(params);
  return readRequiredPromotionItems(result, 'Promotion offer records are required');
}

export async function backendPromotionCouponStocksList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.couponStocks.list(params);
  return readRequiredPromotionItems(result, 'Promotion coupon stock records are required');
}

export async function backendPromotionCodesList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.codes.list(params);
  return readRequiredPromotionItems(result, 'Promotion code records are required');
}

export async function backendPromotionDiscountApplicationsList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.discountApplications.list(params);
  return readRequiredPromotionItems(result, 'Promotion discount application records are required');
}

export async function backendPromotionDiscountAllocationsList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.discountAllocations.list(params);
  return readRequiredPromotionItems(result, 'Promotion discount allocation records are required');
}

export async function backendPromotionCodeRedemptionsList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.codes.redemptions.list(params);
  return readRequiredPromotionItems(result, 'Promotion code redemption records are required');
}

export async function backendPromotionUserCouponsList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.userCoupons.management.list(params);
  return readRequiredPromotionItems(result, 'Promotion user coupon records are required');
}

export async function backendPromotionCouponLedgerEntriesList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.couponLedgerEntries.list(params);
  return readRequiredPromotionItems(result, 'Promotion coupon ledger records are required');
}

export async function backendPromotionBudgetLedgerEntriesList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.budgetLedgerEntries.list(params);
  return readRequiredPromotionItems(result, 'Promotion budget ledger records are required');
}

export async function backendPromotionExternalBindingsList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.externalBindings.list(params);
  return readRequiredPromotionItems(result, 'Promotion external binding records are required');
}

export async function backendPromotionEventsList(
  params?: CommerceRequestParams,
) {
  const result = await getSdkworkCommerceService().admin.promotions.events.list(params);
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
