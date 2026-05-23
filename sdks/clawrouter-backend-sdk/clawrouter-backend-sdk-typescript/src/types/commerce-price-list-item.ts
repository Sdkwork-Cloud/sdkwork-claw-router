/** Commerce price list item schema exposed by Claw Router. */
export interface CommercePriceListItem {
  /** Created at field on commerce price list item. */
  createdAt: string;
  /** Currency code field on commerce price list item. */
  currencyCode: string;
  /** Customer segment field on commerce price list item. */
  customerSegment?: string | null;
  /** Ends at field on commerce price list item. */
  endsAt?: string | null;
  /** Id field on commerce price list item. */
  id: string;
  /** Market code field on commerce price list item. */
  marketCode?: string | null;
  /** Price list no field on commerce price list item. */
  priceListNo: string;
  /** Starts at field on commerce price list item. */
  startsAt?: string | null;
  /** Status field on commerce price list item. */
  status: 'active' | 'inactive' | 'archived';
  /** Updated at field on commerce price list item. */
  updatedAt: string;
}
