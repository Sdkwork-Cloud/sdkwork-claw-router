import type { AdminDeleteResponse } from './admin-delete-response';

/** Catalog products delete result schema exposed by Claw Router. */
export interface CatalogProductsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog products delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
