/** Commerce coupon redemption record schema exposed by Claw Router. */
export interface CommerceCouponRedemptionRecord {
  /** Coupon id field on commerce coupon redemption record. */
  coupon_id: string;
  /** Created at field on commerce coupon redemption record. */
  created_at: string;
  /** Discount amount field on commerce coupon redemption record. */
  discount_amount: string;
  /** Idempotency key field on commerce coupon redemption record. */
  idempotency_key: string;
  /** Order id field on commerce coupon redemption record. */
  order_id: string;
  /** Organization id field on commerce coupon redemption record. */
  organization_id?: string;
  /** Owner user id field on commerce coupon redemption record. */
  owner_user_id: string;
  /** Redeemed at field on commerce coupon redemption record. */
  redeemed_at: string;
  /** Request no field on commerce coupon redemption record. */
  request_no: string;
  /** Rolled back at field on commerce coupon redemption record. */
  rolled_back_at?: string;
  /** Status field on commerce coupon redemption record. */
  status: string;
  /** Tenant id field on commerce coupon redemption record. */
  tenant_id: string;
  /** Updated at field on commerce coupon redemption record. */
  updated_at: string;
}
