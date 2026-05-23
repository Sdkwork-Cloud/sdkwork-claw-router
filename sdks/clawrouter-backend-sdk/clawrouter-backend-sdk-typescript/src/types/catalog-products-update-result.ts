import type { CommerceProductSpuMutationResponse } from './commerce-product-spu-mutation-response';

/** Catalog products update result schema exposed by Claw Router. */
export interface CatalogProductsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog products update result. */
  data?: CommerceProductSpuMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
