import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type CommerceRequestParams = Record<string, unknown>;

export async function backendInvoicesTitlesList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.invoices.titles.list(params);
}

export async function backendInvoicesList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.invoices.list(params);
}

export async function backendInvoicesRetrieve(invoiceId: string) {
  return getSdkworkCommerceService().admin.invoices.retrieve(invoiceId);
}

export async function backendCommerceReportsPaymentReconciliationRetrieve() {
  return getSdkworkCommerceService().admin.commerceReports.paymentReconciliation.retrieve();
}

export async function backendCommerceReportsOrderRevenueList(
  params?: CommerceRequestParams,
) {
  return getSdkworkCommerceService().admin.commerceReports.orderRevenue.list(params);
}

export async function backendCommerceReportsRefundsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.commerceReports.refunds.list(params);
}

export async function backendAuditCommerceEventsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.audit.commerceEvents.list(params);
}
