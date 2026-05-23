import type { AdminRechargePackageMutationResponse } from './admin-recharge-package-mutation-response';

/** Recharges packages create result schema exposed by Claw Router. */
export interface RechargesPackagesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges packages create result. */
  data?: AdminRechargePackageMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
