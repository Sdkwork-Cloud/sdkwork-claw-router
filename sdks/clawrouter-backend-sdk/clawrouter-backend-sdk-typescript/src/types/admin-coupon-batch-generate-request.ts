/** Admin coupon batch generate request schema exposed by Claw Router. */
export interface AdminCouponBatchGenerateRequest {
  /** Number of promo codes to generate in the batch. */
  count: number;
  /** Source coupon identifier used to generate promo codes. */
  couponId: number;
  /** Human-readable coupon batch name. */
  name: string;
  /** Promo code prefix accepted by the backend. */
  prefix: string;
}
