import type { CommerceProductSkuResponse } from './commerce-product-sku-response';

/** Catalog skus retrieve result schema exposed by Claw Router. */
export interface CatalogSkusRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog skus retrieve result. */
  data?: CommerceProductSkuResponse;
  /** Human-readable response message. */
  msg?: string;
}
