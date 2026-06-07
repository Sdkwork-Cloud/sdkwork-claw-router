import { getSdkworkCommerceService } from '@sdkwork/commerce-service';
import { createIdempotencyParams } from 'sdkwork-clawrouter-pc-commons/runtime';

type BackendCommerceService = ReturnType<typeof getSdkworkCommerceService>['admin'];

export async function listInventoryStocks(params?: Parameters<BackendCommerceService['inventory']['stocks']['list']>[0]) {
  return getSdkworkCommerceService().admin.inventory.stocks.list(params);
}

export async function listInventoryReservations(params?: Parameters<BackendCommerceService['inventory']['reservations']['list']>[0]) {
  return getSdkworkCommerceService().admin.inventory.reservations.list(params);
}

export async function listInventoryLedgerEntries(params?: Parameters<BackendCommerceService['inventory']['ledgerEntries']['list']>[0]) {
  return getSdkworkCommerceService().admin.inventory.ledgerEntries.list(params);
}

export async function updateInventoryStock(stockId: string, body: Parameters<BackendCommerceService['inventory']['stocks']['update']>[1]) {
  return getSdkworkCommerceService().admin.inventory.stocks.update(
    stockId,
    body,
    createIdempotencyParams('backend-inventory-stock-update'),
  );
}
