import type { RechargePackagesResponse } from './recharge-packages-response';

/** Account points recharges packages list result schema exposed by Claw Router. */
export interface AccountPointsRechargesPackagesListResult {
  /** Business response code. */
  code: string;
  /** Data field on account points recharges packages list result. */
  data?: RechargePackagesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
