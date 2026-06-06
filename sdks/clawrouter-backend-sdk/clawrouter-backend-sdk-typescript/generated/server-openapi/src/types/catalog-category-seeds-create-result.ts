import type { CommerceCategorySeedInitializeResponse } from './commerce-category-seed-initialize-response';

/** Catalog category seeds create result schema exposed by Claw Router. */
export interface CatalogCategorySeedsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog category seeds create result. */
  data?: CommerceCategorySeedInitializeResponse;
  /** Human-readable response message. */
  msg?: string;
}
