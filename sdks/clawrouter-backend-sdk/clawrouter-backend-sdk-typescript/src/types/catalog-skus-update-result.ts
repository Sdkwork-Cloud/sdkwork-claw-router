import type { CommerceProductSkuMutationResponse } from './commerce-product-sku-mutation-response';

/** Catalog skus update result schema exposed by Claw Router. */
export interface CatalogSkusUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog skus update result. */
  data?: CommerceProductSkuMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
