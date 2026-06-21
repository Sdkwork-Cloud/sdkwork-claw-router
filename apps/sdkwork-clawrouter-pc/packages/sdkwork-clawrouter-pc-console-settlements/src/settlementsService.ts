import {
  ensureSdkworkApiSuccess,
  getSdkworkCommerceAppSdkClient,
  readApiItems,
} from '@sdkwork/clawrouter-pc-commons/runtime';

export interface BillBreakdownItem {
  cost: number;
  usage: number;
  models: number;
}

export interface Bill {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  totalTokens: number;
  totalCost: number;
  status: string;
  breakdown: Record<string, BillBreakdownItem>;
}

export interface SettlementChartData {
  day: string;
  text: number;
  image: number;
  video: number;
  audio: number;
  music: number;
}

export class SettlementsService {
  static async fetchBills(): Promise<Bill[]> {
    const result = await getSdkworkCommerceAppSdkClient().billing.history.list();
    ensureSdkworkApiSuccess(result, 'Failed to load settlement bills');
    return readApiItems(result).map((item) => item as Bill);
  }
}
