/** Persisted coupon snapshot returned by the backend. */
export interface AdminCouponItem {
  /** Id field on admin coupon item. */
  id: string;
  /** Name field on admin coupon item. */
  name: string;
  /** Status field on admin coupon item. */
  status: 'active' | 'inactive';
  /** Type field on admin coupon item. */
  type: 'amount' | 'discount';
  /** Value field on admin coupon item. */
  value: string;
}
