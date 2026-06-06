import { createIdempotencyParams, getClawRouterBackendSdkClient } from 'sdkwork-clawrouter-pc-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export async function listInventoryStocks(params?: Parameters<BackendCommerce['inventory']['stocks']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.inventory.stocks.list(params);
}

export async function listInventoryReservations(params?: Parameters<BackendCommerce['inventory']['reservations']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.inventory.reservations.list(params);
}

export async function listInventoryLedgerEntries(params?: Parameters<BackendCommerce['inventory']['ledgerEntries']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.inventory.ledgerEntries.list(params);
}

export async function updateInventoryStock(stockId: string, body: Parameters<BackendCommerce['inventory']['stocks']['update']>[1]) {
  return getClawRouterBackendSdkClient().commerce.inventory.stocks.update(
    stockId,
    body,
    createIdempotencyParams('backend-inventory-stock-update'),
  );
}
