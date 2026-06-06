import type { CommerceProductCategoryAttributeMutationResponse } from './commerce-product-category-attribute-mutation-response';

/** Catalog category attributes create result schema exposed by Claw Router. */
export interface CatalogCategoryAttributesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog category attributes create result. */
  data?: CommerceProductCategoryAttributeMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
