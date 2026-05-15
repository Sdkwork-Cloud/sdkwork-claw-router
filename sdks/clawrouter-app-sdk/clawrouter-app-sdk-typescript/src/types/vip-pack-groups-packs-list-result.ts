import type { CommerceVipPackGroupPacksResponse } from './commerce-vip-pack-group-packs-response';

/** Vip pack groups packs list result schema exposed by Claw Router. */
export interface VipPackGroupsPacksListResult {
  /** Business response code. */
  code: string;
  /** Data field on vip pack groups packs list result. */
  data?: CommerceVipPackGroupPacksResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
