import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type BackendCommerceService = ReturnType<typeof getSdkworkCommerceService>['admin'];

export async function backendInvoicesTitlesList(params?: Parameters<BackendCommerceService['invoices']['titles']['list']>[0]) {
  return getSdkworkCommerceService().admin.invoices.titles.list(params);
}

export async function backendInvoicesList(params?: Parameters<BackendCommerceService['invoices']['list']>[0]) {
  return getSdkworkCommerceService().admin.invoices.list(params);
}

export async function backendInvoicesRetrieve(invoiceId: string) {
  return getSdkworkCommerceService().admin.invoices.retrieve(invoiceId);
}

export async function backendCommerceReportsPaymentReconciliationRetrieve() {
  return getSdkworkCommerceService().admin.commerceReports.paymentReconciliation.retrieve();
}

export async function backendCommerceReportsOrderRevenueList(
  params?: Parameters<BackendCommerceService['commerceReports']['orderRevenue']['list']>[0],
) {
  return getSdkworkCommerceService().admin.commerceReports.orderRevenue.list(params);
}

export async function backendCommerceReportsRefundsList(params?: Parameters<BackendCommerceService['commerceReports']['refunds']['list']>[0]) {
  return getSdkworkCommerceService().admin.commerceReports.refunds.list(params);
}

export async function backendAuditCommerceEventsList(params?: Parameters<BackendCommerceService['audit']['commerceEvents']['list']>[0]) {
  return getSdkworkCommerceService().admin.audit.commerceEvents.list(params);
}
