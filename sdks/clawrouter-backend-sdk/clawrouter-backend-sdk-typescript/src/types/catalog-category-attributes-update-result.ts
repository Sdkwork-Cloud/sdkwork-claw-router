import type { CommerceProductCategoryAttributeMutationResponse } from './commerce-product-category-attribute-mutation-response';

/** Catalog category attributes update result schema exposed by Claw Router. */
export interface CatalogCategoryAttributesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog category attributes update result. */
  data?: CommerceProductCategoryAttributeMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
