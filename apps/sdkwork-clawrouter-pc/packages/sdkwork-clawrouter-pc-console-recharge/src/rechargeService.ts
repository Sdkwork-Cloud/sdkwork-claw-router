import {
  ensureSdkworkApiSuccess,
  getSdkworkCommerceAppSdkClient,
  readApiItems,
} from '@sdkwork/clawrouter-pc-commons/runtime';

export interface RechargePackage {
  id: string;
  priceAmount: number;
  currencyCode: string;
  bonusPoints: number;
  grantAmount: number;
  points: number;
}

export class RechargeService {
  static async fetchPackages(): Promise<RechargePackage[]> {
    const result = await getSdkworkCommerceAppSdkClient().recharges.packages.list();
    ensureSdkworkApiSuccess(result, 'Failed to load recharge packages');
    return readApiItems(result).map((item) => item as RechargePackage);
  }
}
