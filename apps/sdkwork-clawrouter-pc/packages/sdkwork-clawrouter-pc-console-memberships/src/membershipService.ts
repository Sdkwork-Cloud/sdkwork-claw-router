import {
  ensureSdkworkApiSuccess,
  getSdkworkCommerceAppSdkClient,
  readApiRecord,
} from '@sdkwork/clawrouter-pc-commons/runtime';

export interface MembershipOverview {
  summary: Record<string, unknown>;
  packageGroups: unknown[];
  benefits: unknown[];
}

export class MembershipService {
  static async fetchOverview(): Promise<MembershipOverview> {
    const result = await getSdkworkCommerceAppSdkClient().memberships.current.retrieve();
    ensureSdkworkApiSuccess(result, 'Failed to load membership overview');
    return readApiRecord(result) as MembershipOverview;
  }
}
