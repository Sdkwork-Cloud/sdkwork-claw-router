/** Commerce coupon record schema exposed by Claw Router. */
export interface CommerceCouponRecord {
  /** Claimed at field on commerce coupon record. */
  claimed_at?: string;
  /** Coupon code field on commerce coupon record. */
  coupon_code: string;
  /** Created at field on commerce coupon record. */
  created_at: string;
  /** Disabled at field on commerce coupon record. */
  disabled_at?: string;
  /** Expires at field on commerce coupon record. */
  expires_at?: string;
  /** Idempotency key field on commerce coupon record. */
  idempotency_key: string;
  /** Issue batch id field on commerce coupon record. */
  issue_batch_id?: string;
  /** Organization id field on commerce coupon record. */
  organization_id?: string;
  /** Owner user id field on commerce coupon record. */
  owner_user_id?: string;
  /** Redeemed at field on commerce coupon record. */
  redeemed_at?: string;
  /** Request no field on commerce coupon record. */
  request_no: string;
  /** Status field on commerce coupon record. */
  status: string;
  /** Template id field on commerce coupon record. */
  template_id: string;
  /** Tenant id field on commerce coupon record. */
  tenant_id: string;
  /** Updated at field on commerce coupon record. */
  updated_at: string;
}
