import {
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

type CommerceRequestParams = Record<string, unknown>;
type CommerceRequestBody = Record<string, unknown>;

export async function backendRechargesOrdersList(params?: CommerceRequestParams) {
  const result = await getSdkworkCommerceService().admin.recharges.orders.list(params);
  return readRequiredRechargeItems(result, 'Recharge order records are required');
}

export async function backendWalletAccountsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.wallet.accounts.list(params);
}

export async function backendWalletLedgerEntriesList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.wallet.ledgerEntries.list(params);
}

export async function backendWalletExchangeRulesList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().admin.wallet.exchangeRules.list(params);
}

export async function backendWalletAdjustmentsCreate(body: CommerceRequestBody) {
  return getSdkworkCommerceService().admin.wallet.adjustments.create(body);
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
