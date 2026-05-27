/** Promotion coupon ledger entry record schema exposed by Claw Router. */
export interface PromotionCouponLedgerEntryRecord {
  /** Application id field on promotion coupon ledger entry record. */
  application_id?: string;
  /** Business type field on promotion coupon ledger entry record. */
  business_type: string;
  /** Created at field on promotion coupon ledger entry record. */
  created_at: string;
  /** Direction field on promotion coupon ledger entry record. */
  direction: string;
  /** Idempotency key field on promotion coupon ledger entry record. */
  idempotency_key: string;
  /** Ledger no field on promotion coupon ledger entry record. */
  ledger_no: string;
  /** Occurred at field on promotion coupon ledger entry record. */
  occurred_at: string;
  /** Offer id field on promotion coupon ledger entry record. */
  offer_id: string;
  /** Organization id field on promotion coupon ledger entry record. */
  organization_id?: string;
  /** Request no field on promotion coupon ledger entry record. */
  request_no: string;
  /** Source id field on promotion coupon ledger entry record. */
  source_id: string;
  /** Source type field on promotion coupon ledger entry record. */
  source_type: string;
  /** Stock id field on promotion coupon ledger entry record. */
  stock_id: string;
  /** Subject id field on promotion coupon ledger entry record. */
  subject_id?: string;
  /** Subject type field on promotion coupon ledger entry record. */
  subject_type?: string;
  /** Tenant id field on promotion coupon ledger entry record. */
  tenant_id: string;
  /** User coupon id field on promotion coupon ledger entry record. */
  user_coupon_id?: string;
}
