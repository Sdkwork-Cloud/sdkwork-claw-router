import type { AdminRedemptionRecordItem } from './admin-redemption-record-item';

/** Admin redemption records response schema exposed by Claw Router. */
export interface AdminRedemptionRecordsResponse {
  /** Items field on admin redemption records response. */
  items: AdminRedemptionRecordItem[];
}
