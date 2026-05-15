import type { AdminRechargePackagesResponse } from './admin-recharge-packages-response';

/** Recharges packages list result schema exposed by Claw Router. */
export interface RechargesPackagesListResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges packages list result. */
  data?: AdminRechargePackagesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
