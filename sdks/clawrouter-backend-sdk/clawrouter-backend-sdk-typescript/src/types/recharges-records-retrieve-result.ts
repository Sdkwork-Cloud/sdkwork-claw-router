import type { AdminRechargeRecordItem } from './admin-recharge-record-item';

/** Recharges records retrieve result schema exposed by Claw Router. */
export interface RechargesRecordsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges records retrieve result. */
  data?: AdminRechargeRecordItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
