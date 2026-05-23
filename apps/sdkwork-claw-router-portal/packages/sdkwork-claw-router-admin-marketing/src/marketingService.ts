import {
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredNumber,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface ReferralStat {
  id: string;
  inviter: string;
  total_invited: number;
  total_revenue: string;
  bonus_awarded: string;
  link: string;
}

export class MarketingService {
  static async fetchReferralStats(): Promise<ReferralStat[]> {
    const result = await getClawRouterBackendSdkClient().system.marketing.referralStats.list();
    return readRequiredApiItems(result, 'Failed to fetch referral stats')
      .map(normalizeReferralStat);
  }
}

function normalizeReferralStat(value: unknown): ReferralStat {
  const item = readRequiredRecord(value, 'Referral stat record is required');
  return {
    id: readRequiredString(item, 'id', 'Referral stat id is required'),
    inviter: readRequiredString(item, 'inviter', 'Referral inviter is required'),
    total_invited: readRequiredNumber(item, 'total_invited', 'Referral invited total is required'),
    total_revenue: readRequiredString(item, 'total_revenue', 'Referral revenue is required'),
    bonus_awarded: readRequiredString(item, 'bonus_awarded', 'Referral bonus is required'),
    link: readRequiredString(item, 'link', 'Referral link is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
