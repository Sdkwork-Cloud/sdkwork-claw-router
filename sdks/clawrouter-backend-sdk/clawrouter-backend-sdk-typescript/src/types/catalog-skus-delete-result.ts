import type { AdminDeleteResponse } from './admin-delete-response';

/** Catalog skus delete result schema exposed by Claw Router. */
export interface CatalogSkusDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog skus delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
