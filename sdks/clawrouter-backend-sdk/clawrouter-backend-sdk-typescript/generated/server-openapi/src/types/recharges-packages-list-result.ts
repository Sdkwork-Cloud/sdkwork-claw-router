import type { AdminRechargePackageListResponse } from './admin-recharge-package-list-response';

/** Recharges packages list result schema exposed by Claw Router. */
export interface RechargesPackagesListResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges packages list result. */
  data?: AdminRechargePackageListResponse;
  /** Human-readable response message. */
  msg?: string;
}
