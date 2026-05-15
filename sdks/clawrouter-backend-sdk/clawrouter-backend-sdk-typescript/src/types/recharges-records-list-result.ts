import type { AdminRechargeRecordsResponse } from './admin-recharge-records-response';

/** Recharges records list result schema exposed by Claw Router. */
export interface RechargesRecordsListResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges records list result. */
  data?: AdminRechargeRecordsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
