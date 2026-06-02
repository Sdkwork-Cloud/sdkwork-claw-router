/** Commerce order amount breakdown record schema exposed by Claw Router. */
export interface CommerceOrderAmountBreakdownRecord {
  /** Created at field on commerce order amount breakdown record. */
  created_at: string;
  /** Currency code field on commerce order amount breakdown record. */
  currency_code: string;
  /** Discount amount field on commerce order amount breakdown record. */
  discount_amount: string;
  /** Id field on commerce order amount breakdown record. */
  id?: string;
  /** Order id field on commerce order amount breakdown record. */
  order_id: string;
  /** Original amount field on commerce order amount breakdown record. */
  original_amount: string;
  /** Payable amount field on commerce order amount breakdown record. */
  payable_amount: string;
  /** Tenant id field on commerce order amount breakdown record. */
  tenant_id: string;
}
