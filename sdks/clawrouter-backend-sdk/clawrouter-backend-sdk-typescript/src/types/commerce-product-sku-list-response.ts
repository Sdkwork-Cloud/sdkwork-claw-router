import type { CommerceProductSkuItem } from './commerce-product-sku-item';

/** Commerce product sku list response schema exposed by Claw Router. */
export interface CommerceProductSkuListResponse {
  /** Items field on commerce product sku list response. */
  items: CommerceProductSkuItem[];
  /** Page field on commerce product sku list response. */
  page: number;
  /** Page size field on commerce product sku list response. */
  pageSize: number;
  /** Total field on commerce product sku list response. */
  total: number;
}
