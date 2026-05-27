/** Promotion code redemption record schema exposed by Claw Router. */
export interface PromotionCodeRedemptionRecord {
  /** Code id field on promotion code redemption record. */
  code_id?: string;
  /** Created at field on promotion code redemption record. */
  created_at: string;
  /** Currency code field on promotion code redemption record. */
  currency_code: string;
  /** Failure code field on promotion code redemption record. */
  failure_code?: string;
  /** Failure message field on promotion code redemption record. */
  failure_message?: string;
  /** Idempotency key field on promotion code redemption record. */
  idempotency_key: string;
  /** Occurred at field on promotion code redemption record. */
  occurred_at: string;
  /** Offer id field on promotion code redemption record. */
  offer_id: string;
  /** Offer version id field on promotion code redemption record. */
  offer_version_id: string;
  /** Organization id field on promotion code redemption record. */
  organization_id?: string;
  /** Owner user id field on promotion code redemption record. */
  owner_user_id?: string;
  /** Redemption channel field on promotion code redemption record. */
  redemption_channel: string;
  /** Redemption no field on promotion code redemption record. */
  redemption_no: string;
  /** Redemption scene field on promotion code redemption record. */
  redemption_scene?: string;
  /** Request no field on promotion code redemption record. */
  request_no: string;
  /** Result status field on promotion code redemption record. */
  result_status: string;
  /** Stock id field on promotion code redemption record. */
  stock_id: string;
  /** Subject id field on promotion code redemption record. */
  subject_id: string;
  /** Subject type field on promotion code redemption record. */
  subject_type: string;
  /** Submitted code hash field on promotion code redemption record. */
  submitted_code_hash: string;
  /** Submitted code suffix field on promotion code redemption record. */
  submitted_code_suffix?: string;
  /** Tenant id field on promotion code redemption record. */
  tenant_id: string;
  /** User coupon id field on promotion code redemption record. */
  user_coupon_id?: string;
}
