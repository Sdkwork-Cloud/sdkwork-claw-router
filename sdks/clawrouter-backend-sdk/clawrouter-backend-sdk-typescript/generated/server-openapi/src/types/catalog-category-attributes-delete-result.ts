import type { AdminDeleteResponse } from './admin-delete-response';

/** Catalog category attributes delete result schema exposed by Claw Router. */
export interface CatalogCategoryAttributesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog category attributes delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
