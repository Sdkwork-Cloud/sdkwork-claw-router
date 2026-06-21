import {
  ensureSdkworkApiSuccess,
  getSdkworkCommerceAppSdkClient,
  readApiItems,
} from '@sdkwork/clawrouter-pc-commons/runtime';

export interface CommerceHistoryItem {
  id: string;
  amount: number;
  date: string;
  status: string;
}

export class WalletService {
  static async fetchBillingHistory(): Promise<CommerceHistoryItem[]> {
    const result = await getSdkworkCommerceAppSdkClient().wallet.ledgerEntries.list();
    ensureSdkworkApiSuccess(result, 'Failed to load wallet history');
    return readApiItems(result).map((item) => item as CommerceHistoryItem);
  }
}
