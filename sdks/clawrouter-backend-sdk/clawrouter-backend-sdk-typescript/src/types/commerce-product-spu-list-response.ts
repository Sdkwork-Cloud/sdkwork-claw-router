import type { CommerceProductSpuItem } from './commerce-product-spu-item';

/** Commerce product spu list response schema exposed by Claw Router. */
export interface CommerceProductSpuListResponse {
  /** Items field on commerce product spu list response. */
  items: CommerceProductSpuItem[];
  /** Page field on commerce product spu list response. */
  page: number;
  /** Page size field on commerce product spu list response. */
  pageSize: number;
  /** Total field on commerce product spu list response. */
  total: number;
}
