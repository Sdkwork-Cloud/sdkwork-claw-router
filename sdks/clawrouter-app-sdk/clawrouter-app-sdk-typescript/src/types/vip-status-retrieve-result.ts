import type { CommerceVipInfoResponse } from './commerce-vip-info-response';

/** Vip status retrieve result schema exposed by Claw Router. */
export interface VipStatusRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip status retrieve result. */
  data?: CommerceVipInfoResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
