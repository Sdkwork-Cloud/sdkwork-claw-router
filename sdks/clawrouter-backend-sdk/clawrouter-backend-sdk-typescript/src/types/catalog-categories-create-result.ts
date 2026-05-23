import type { CommerceProductCategoryMutationResponse } from './commerce-product-category-mutation-response';

/** Catalog categories create result schema exposed by Claw Router. */
export interface CatalogCategoriesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog categories create result. */
  data?: CommerceProductCategoryMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
