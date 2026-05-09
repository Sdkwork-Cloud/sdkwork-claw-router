import type { RechargePackagesResponse } from './recharge-packages-response';

export interface FetchPackagesResult {
  /** Business response code. */
  code: string;
  data?: RechargePackagesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
