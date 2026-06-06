import type { CommerceProductCategoryAttributeListResponse } from './commerce-product-category-attribute-list-response';

/** Catalog category attributes list result schema exposed by Claw Router. */
export interface CatalogCategoryAttributesListResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog category attributes list result. */
  data?: CommerceProductCategoryAttributeListResponse;
  /** Human-readable response message. */
  msg?: string;
}
