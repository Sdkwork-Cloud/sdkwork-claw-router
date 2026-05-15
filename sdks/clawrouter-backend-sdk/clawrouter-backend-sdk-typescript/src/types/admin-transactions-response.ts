import type { AdminTransactionRecordItem } from './admin-transaction-record-item';

/** Admin transactions response schema exposed by Claw Router. */
export interface AdminTransactionsResponse {
  /** Items field on admin transactions response. */
  items: AdminTransactionRecordItem[];
}
