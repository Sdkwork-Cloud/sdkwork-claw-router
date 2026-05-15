import type { AdminRechargeRecordItem } from './admin-recharge-record-item';

/** Admin recharge records response schema exposed by Claw Router. */
export interface AdminRechargeRecordsResponse {
  /** Items field on admin recharge records response. */
  items: AdminRechargeRecordItem[];
}
