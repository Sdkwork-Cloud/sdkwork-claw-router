import { getClawRouterBackendSdkClient } from 'sdkwork-clawrouter-pc-commons/runtime';

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
