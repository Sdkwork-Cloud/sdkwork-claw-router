import type { CommerceProductSkuListResponse } from './commerce-product-sku-list-response';

/** Catalog skus list result schema exposed by Claw Router. */
export interface CatalogSkusListResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog skus list result. */
  data?: CommerceProductSkuListResponse;
  /** Human-readable response message. */
  msg?: string;
}
