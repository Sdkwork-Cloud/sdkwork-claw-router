import type { RechargePackagesResponse } from './recharge-packages-response';

/** Vip packs list result schema exposed by Claw Router. */
export interface VipPacksListResult {
  /** Business response code. */
  code: string;
  /** Data field on vip packs list result. */
  data?: RechargePackagesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
