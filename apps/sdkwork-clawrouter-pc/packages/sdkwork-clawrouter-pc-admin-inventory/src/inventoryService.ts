import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type CommerceRequestParams = Record<string, unknown>;
type CommerceRequestBody = Record<string, unknown>;

export async function listInventoryStocks(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.inventory.stocks.list(params);
}

export async function listInventoryReservations(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.inventory.reservations.list(params);
}

export async function listInventoryLedgerEntries(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.inventory.ledgerEntries.list(params);
}

export async function updateInventoryStock(stockId: string, body: CommerceRequestBody) {
  return getSdkworkCommerceService().admin.inventory.stocks.update(
    stockId,
    body,
  );
}
