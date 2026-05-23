import {
  createRequestParams,
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export async function backendRechargesPackagesList(params?: Parameters<BackendCommerce['recharges']['packages']['list']>[0]) {
  const result = await getClawRouterBackendSdkClient().commerce.recharges.packages.list(params);
  return readRequiredRechargeItems(result, 'Recharge package records are required');
}

export async function backendRechargesOrdersList(params?: Parameters<BackendCommerce['recharges']['orders']['list']>[0]) {
  const result = await getClawRouterBackendSdkClient().commerce.recharges.orders.list(params);
  return readRequiredRechargeItems(result, 'Recharge order records are required');
}

export async function backendWalletAccountsList(params?: Parameters<BackendCommerce['wallet']['accounts']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.wallet.accounts.list(params);
}

export async function backendWalletLedgerEntriesList(params?: Parameters<BackendCommerce['wallet']['ledgerEntries']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.wallet.ledgerEntries.list(params);
}

export async function backendWalletExchangeRulesList(params?: Parameters<BackendCommerce['wallet']['exchangeRules']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.wallet.exchangeRules.list(params);
}

export async function backendWalletAdjustmentsCreate(body: Parameters<BackendCommerce['wallet']['adjustments']['create']>[0]) {
  return getClawRouterBackendSdkClient().commerce.wallet.adjustments.create(
    body,
    createRequestParams('backend-wallet-adjustment-create'),
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
