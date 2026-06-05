import type { CommerceProductAttributeItem } from './commerce-product-attribute-item';

/** Commerce product attribute list response schema exposed by Claw Router. */
export interface CommerceProductAttributeListResponse {
  /** Items field on commerce product attribute list response. */
  items: CommerceProductAttributeItem[];
  /** Page field on commerce product attribute list response. */
  page: string;
  /** Page size field on commerce product attribute list response. */
  pageSize: string;
  /** Total field on commerce product attribute list response. */
  total: string;
}
