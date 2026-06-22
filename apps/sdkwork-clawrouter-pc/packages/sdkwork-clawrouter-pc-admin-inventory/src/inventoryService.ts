import { getClawRouterBackendSdkClient } from '@sdkwork/clawrouter-pc-commons/sdk-clients';
type BackendCommerceService = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export async function listInventoryStocks(params?: Parameters<BackendCommerceService['inventory']['stocks']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.inventory.stocks.list(params);
}

export async function listInventoryReservations(params?: Parameters<BackendCommerceService['inventory']['reservations']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.inventory.reservations.list(params);
}

export async function listInventoryLedgerEntries(params?: Parameters<BackendCommerceService['inventory']['ledgerEntries']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.inventory.ledgerEntries.list(params);
}

export async function updateInventoryStock(stockId: string, body: Parameters<BackendCommerceService['inventory']['stocks']['update']>[1]) {
  return getClawRouterBackendSdkClient().commerce.inventory.stocks.update(
    stockId,
    body,
  );
}
