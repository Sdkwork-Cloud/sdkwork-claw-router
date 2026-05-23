import type { CommercePriceListResponse } from './commerce-price-list-response';

/** Catalog price lists list result schema exposed by Claw Router. */
export interface CatalogPriceListsListResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog price lists list result. */
  data?: CommercePriceListResponse;
  /** Human-readable response message. */
  msg?: string;
}
