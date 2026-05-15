import type { CommerceVipInfoResponse } from './commerce-vip-info-response';

/** Vip info retrieve result schema exposed by Claw Router. */
export interface VipInfoRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip info retrieve result. */
  data?: CommerceVipInfoResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
