import type { CommerceVipPackGroupItem } from './commerce-vip-pack-group-item';

/** Vip pack groups retrieve result schema exposed by Claw Router. */
export interface VipPackGroupsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip pack groups retrieve result. */
  data?: CommerceVipPackGroupItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
