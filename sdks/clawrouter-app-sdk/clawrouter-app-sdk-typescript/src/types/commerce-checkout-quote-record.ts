/** Commerce checkout quote record schema exposed by Claw Router. */
export interface CommerceCheckoutQuoteRecord {
  /** Checkout session id field on commerce checkout quote record. */
  checkout_session_id: string;
  /** Created at field on commerce checkout quote record. */
  created_at: string;
  /** Currency code field on commerce checkout quote record. */
  currency_code: string;
  /** Discount amount field on commerce checkout quote record. */
  discount_amount: string;
  /** Expires at field on commerce checkout quote record. */
  expires_at: string;
  /** Id field on commerce checkout quote record. */
  id?: string;
  /** Organization id field on commerce checkout quote record. */
  organization_id?: string;
  /** Original amount field on commerce checkout quote record. */
  original_amount: string;
  /** Payable amount field on commerce checkout quote record. */
  payable_amount: string;
  /** Quote no field on commerce checkout quote record. */
  quote_no: string;
  /** Shipping amount field on commerce checkout quote record. */
  shipping_amount: string;
  /** Tax amount field on commerce checkout quote record. */
  tax_amount: string;
  /** Tenant id field on commerce checkout quote record. */
  tenant_id: string;
}
