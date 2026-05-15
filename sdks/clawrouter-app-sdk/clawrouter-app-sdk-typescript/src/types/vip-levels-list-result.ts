import type { CommerceVipLevelsResponse } from './commerce-vip-levels-response';

/** Vip levels list result schema exposed by Claw Router. */
export interface VipLevelsListResult {
  /** Business response code. */
  code: string;
  /** Data field on vip levels list result. */
  data?: CommerceVipLevelsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
