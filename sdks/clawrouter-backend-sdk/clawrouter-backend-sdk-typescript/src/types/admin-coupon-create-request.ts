/** Admin coupon create request schema exposed by Claw Router. */
export interface AdminCouponCreateRequest {
  /** Human-readable coupon name. */
  name: string;
  /** Optional coupon availability state. */
  status?: 'active' | 'inactive';
  /** Coupon value mode accepted by the backend. */
  type: 'amount' | 'discount';
  /** Positive money amount or discount percentage depending on coupon type. */
  value: string;
}
