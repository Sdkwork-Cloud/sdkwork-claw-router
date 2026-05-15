import type { AdminBillingRecordItem } from './admin-billing-record-item';

/** Admin billing records response schema exposed by Claw Router. */
export interface AdminBillingRecordsResponse {
  /** Items field on admin billing records response. */
  items: AdminBillingRecordItem[];
}
