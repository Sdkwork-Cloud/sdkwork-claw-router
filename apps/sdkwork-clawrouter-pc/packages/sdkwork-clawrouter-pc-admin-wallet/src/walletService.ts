import {
  createIdempotencyParams,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type BackendCommerceService = ReturnType<typeof getSdkworkCommerceService>['admin'];

export async function backendRechargesOrdersList(params?: Parameters<BackendCommerceService['recharges']['orders']['list']>[0]) {
  const result = await getSdkworkCommerceService().admin.recharges.orders.list(params);
  return readRequiredRechargeItems(result, 'Recharge order records are required');
}

export async function backendWalletAccountsList(params?: Parameters<BackendCommerceService['wallet']['accounts']['list']>[0]) {
  return getSdkworkCommerceService().admin.wallet.accounts.list(params);
}

export async function backendWalletLedgerEntriesList(params?: Parameters<BackendCommerceService['wallet']['ledgerEntries']['list']>[0]) {
  return getSdkworkCommerceService().admin.wallet.ledgerEntries.list(params);
}

export async function backendWalletExchangeRulesList(params?: Parameters<BackendCommerceService['wallet']['exchangeRules']['list']>[0]) {
  return getSdkworkCommerceService().admin.wallet.exchangeRules.list(params);
}

export async function backendWalletAdjustmentsCreate(body: Parameters<BackendCommerceService['wallet']['adjustments']['create']>[0]) {
  return getSdkworkCommerceService().admin.wallet.adjustments.create(
    body,
    createIdempotencyParams('backend-wallet-adjustment-create'),
  );
}

function readRequiredRechargeItems(result: unknown, listMessage: string): ApiRecord[] {
  return readRequiredApiItems(result, listMessage)
    .map((value) => {
      const item = readRequiredRecord(value, listMessage);
      readRequiredString(item, 'id', 'Recharge record id is required');
      return item;
    });
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
