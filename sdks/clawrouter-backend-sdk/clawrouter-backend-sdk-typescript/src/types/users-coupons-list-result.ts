import type { AdminRedemptionRecordsResponse } from './admin-redemption-records-response';

/** Users coupons list result schema exposed by Claw Router. */
export interface UsersCouponsListResult {
  /** Business response code. */
  code: string;
  /** Data field on users coupons list result. */
  data?: AdminRedemptionRecordsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
