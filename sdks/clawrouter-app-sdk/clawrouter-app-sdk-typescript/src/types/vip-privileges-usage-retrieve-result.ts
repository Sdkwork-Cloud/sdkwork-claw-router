import type { CommerceVipPrivilegeUsageResponse } from './commerce-vip-privilege-usage-response';

/** Vip privileges usage retrieve result schema exposed by Claw Router. */
export interface VipPrivilegesUsageRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip privileges usage retrieve result. */
  data?: CommerceVipPrivilegeUsageResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
