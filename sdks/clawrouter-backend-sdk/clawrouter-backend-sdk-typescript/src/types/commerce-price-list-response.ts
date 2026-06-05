import type { CommercePriceListItem } from './commerce-price-list-item';

/** Commerce price list response schema exposed by Claw Router. */
export interface CommercePriceListResponse {
  /** Items field on commerce price list response. */
  items: CommercePriceListItem[];
  /** Page field on commerce price list response. */
  page: string;
  /** Page size field on commerce price list response. */
  pageSize: string;
  /** Total field on commerce price list response. */
  total: string;
}
