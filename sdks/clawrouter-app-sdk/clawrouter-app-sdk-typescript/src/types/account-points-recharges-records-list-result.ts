import type { CommerceRechargeRecordsResponse } from './commerce-recharge-records-response';

/** Account points recharges records list result schema exposed by Claw Router. */
export interface AccountPointsRechargesRecordsListResult {
  /** Business response code. */
  code: string;
  /** Data field on account points recharges records list result. */
  data?: CommerceRechargeRecordsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
