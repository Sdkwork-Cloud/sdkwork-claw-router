import {
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export async function backendInvoicesTitlesList(params?: Parameters<BackendCommerce['invoices']['titles']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.invoices.titles.list(params);
}

export async function backendInvoicesList(params?: Parameters<BackendCommerce['invoices']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.invoices.list(params);
}

export async function backendInvoicesRetrieve(invoiceId: string) {
  return getClawRouterBackendSdkClient().commerce.invoices.retrieve(invoiceId);
}

export async function backendCouponsTemplatesList(params?: Parameters<BackendCommerce['coupons']['templates']['list']>[0]) {
  const result = await getClawRouterBackendSdkClient().commerce.coupons.templates.list(params);
  return readRequiredCouponItems(result);
}

export async function backendCouponsCampaignsList(params?: Parameters<BackendCommerce['coupons']['campaigns']['list']>[0]) {
  const result = await getClawRouterBackendSdkClient().commerce.coupons.campaigns.list(params);
  return readRequiredCouponBatchItems(result);
}

export async function backendCouponsCodesList(params?: Parameters<BackendCommerce['coupons']['codes']['list']>[0]) {
  const result = await getClawRouterBackendSdkClient().commerce.coupons.codes.list(params);
  return readRequiredPromoCodeItems(result);
}

export async function backendCouponsRedemptionsList(params?: Parameters<BackendCommerce['coupons']['redemptions']['list']>[0]) {
  const result = await getClawRouterBackendSdkClient().commerce.coupons.redemptions.list(params);
  return readRequiredRedemptionItems(result);
}

export async function backendCommerceReportsPaymentReconciliationRetrieve() {
  return getClawRouterBackendSdkClient().commerce.commerceReports.paymentReconciliation.retrieve();
}

export async function backendCommerceReportsOrderRevenueList(
  params?: Parameters<BackendCommerce['commerceReports']['orderRevenue']['list']>[0],
) {
  return getClawRouterBackendSdkClient().commerce.commerceReports.orderRevenue.list(params);
}

export async function backendCommerceReportsRefundsList(params?: Parameters<BackendCommerce['commerceReports']['refunds']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.commerceReports.refunds.list(params);
}

export async function backendAuditCommerceEventsList(params?: Parameters<BackendCommerce['audit']['commerceEvents']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.audit.commerceEvents.list(params);
}

function readRequiredCouponItems(result: unknown): ApiRecord[] {
  return readRequiredStableIdItems(result, 'Coupon records are required', (item) => {
    readRequiredString(item, 'id', 'Coupon id is required');
  });
}

function readRequiredCouponBatchItems(result: unknown): ApiRecord[] {
  return readRequiredStableIdItems(result, 'Coupon batch records are required', (item) => {
    readRequiredString(item, 'id', 'Coupon batch id is required');
  });
}

function readRequiredPromoCodeItems(result: unknown): ApiRecord[] {
  return readRequiredStableIdItems(result, 'Promo code records are required', (item) => {
    readRequiredString(item, 'id', 'Promo code id is required');
  });
}

function readRequiredRedemptionItems(result: unknown): ApiRecord[] {
  return readRequiredStableIdItems(result, 'Redemption records are required', (item) => {
    readRequiredString(item, 'id', 'Redemption record id is required');
  });
}

function readRequiredStableIdItems(
  result: unknown,
  listMessage: string,
  assertStableId: (item: ApiRecord) => void,
): ApiRecord[] {
  return readRequiredApiItems(result, listMessage)
    .map((value) => {
      const item = readRequiredRecord(value, listMessage);
      assertStableId(item);
      return item;
    });
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
