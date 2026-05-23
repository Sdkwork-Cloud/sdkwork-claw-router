import type { CommerceProductSkuMutationResponse } from './commerce-product-sku-mutation-response';

/** Catalog skus create result schema exposed by Claw Router. */
export interface CatalogSkusCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog skus create result. */
  data?: CommerceProductSkuMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
