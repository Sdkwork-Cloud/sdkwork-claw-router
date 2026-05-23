/** Commerce price list mutation request schema exposed by Claw Router. */
export interface CommercePriceListMutationRequest {
  /** Currency code field on commerce price list mutation request. */
  currencyCode: string;
  /** Customer segment field on commerce price list mutation request. */
  customerSegment?: string | null;
  /** Ends at field on commerce price list mutation request. */
  endsAt?: string | null;
  /** Market code field on commerce price list mutation request. */
  marketCode?: string | null;
  /** Price list no field on commerce price list mutation request. */
  priceListNo: string;
  /** Starts at field on commerce price list mutation request. */
  startsAt?: string | null;
  /** Status field on commerce price list mutation request. */
  status: 'active' | 'inactive' | 'archived';
}
