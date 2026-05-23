import type { CommerceProductSpuListResponse } from './commerce-product-spu-list-response';

/** Catalog products list result schema exposed by Claw Router. */
export interface CatalogProductsListResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog products list result. */
  data?: CommerceProductSpuListResponse;
  /** Human-readable response message. */
  msg?: string;
}
