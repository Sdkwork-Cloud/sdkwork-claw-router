import type { CommerceProductCategoryItem } from './commerce-product-category-item';

/** Commerce product category list response schema exposed by Claw Router. */
export interface CommerceProductCategoryListResponse {
  /** Items field on commerce product category list response. */
  items: CommerceProductCategoryItem[];
  /** Page field on commerce product category list response. */
  page: number;
  /** Page size field on commerce product category list response. */
  pageSize: number;
  /** Total field on commerce product category list response. */
  total: number;
}
