import type { CommerceProductSpuMutationResponse } from './commerce-product-spu-mutation-response';

/** Catalog products create result schema exposed by Claw Router. */
export interface CatalogProductsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog products create result. */
  data?: CommerceProductSpuMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
