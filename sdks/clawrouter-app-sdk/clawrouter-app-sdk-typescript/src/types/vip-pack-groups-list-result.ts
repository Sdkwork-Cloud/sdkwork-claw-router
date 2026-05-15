import type { CommerceVipPackGroupsResponse } from './commerce-vip-pack-groups-response';

/** Vip pack groups list result schema exposed by Claw Router. */
export interface VipPackGroupsListResult {
  /** Business response code. */
  code: string;
  /** Data field on vip pack groups list result. */
  data?: CommerceVipPackGroupsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
