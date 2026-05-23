import type { AdminDeleteResponse } from './admin-delete-response';

/** Catalog categories delete result schema exposed by Claw Router. */
export interface CatalogCategoriesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog categories delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
