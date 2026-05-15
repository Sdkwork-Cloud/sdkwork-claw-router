import type { CommerceVipPackItem } from './commerce-vip-pack-item';

/** Vip packs retrieve result schema exposed by Claw Router. */
export interface VipPacksRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip packs retrieve result. */
  data?: CommerceVipPackItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
