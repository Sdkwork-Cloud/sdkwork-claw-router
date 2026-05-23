import type { AdminRechargePackageMutationResponse } from './admin-recharge-package-mutation-response';

/** Recharges packages update result schema exposed by Claw Router. */
export interface RechargesPackagesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges packages update result. */
  data?: AdminRechargePackageMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
