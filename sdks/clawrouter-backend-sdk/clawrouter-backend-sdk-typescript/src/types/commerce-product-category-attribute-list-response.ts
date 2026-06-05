import type { CommerceProductCategoryAttributeItem } from './commerce-product-category-attribute-item';

/** Commerce product category attribute list response schema exposed by Claw Router. */
export interface CommerceProductCategoryAttributeListResponse {
  /** Items field on commerce product category attribute list response. */
  items: CommerceProductCategoryAttributeItem[];
  /** Page field on commerce product category attribute list response. */
  page: string;
  /** Page size field on commerce product category attribute list response. */
  pageSize: string;
  /** Total field on commerce product category attribute list response. */
  total: string;
}
