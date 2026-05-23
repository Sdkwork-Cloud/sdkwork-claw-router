import type { CommercePriceListMutationResponse } from './commerce-price-list-mutation-response';

/** Catalog price lists create result schema exposed by Claw Router. */
export interface CatalogPriceListsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on catalog price lists create result. */
  data?: CommercePriceListMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
