/** Persisted coupon batch snapshot returned by the backend. */
export interface AdminCouponBatchItem {
  count: number;
  couponId: string;
  createdAt: string;
  id: string;
  name: string;
  prefix: string;
}
