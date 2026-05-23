import type { CommerceProductSpuDetailResponse } from './commerce-product-spu-detail-response';

/** Catalog products retrieve result schema exposed by Claw Router. */
export interface CatalogProductsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog products retrieve result. */
  data?: CommerceProductSpuDetailResponse;
  /** Human-readable response message. */
  msg?: string;
}
