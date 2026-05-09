/** Persisted coupon snapshot returned by the backend. */
export interface AdminCouponItem {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  type: 'amount' | 'discount';
  value: string;
}
