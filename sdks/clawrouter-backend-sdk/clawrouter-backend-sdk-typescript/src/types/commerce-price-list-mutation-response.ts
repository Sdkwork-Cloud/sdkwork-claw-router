import type { CommercePriceListItem } from './commerce-price-list-item';

/** Commerce price list mutation response schema exposed by Claw Router. */
export interface CommercePriceListMutationResponse {
  /** Item field on commerce price list mutation response. */
  item: CommercePriceListItem;
}
