import type { CommerceCouponCatalogResponse } from './commerce-coupon-catalog-response';

/** Coupons catalog list result schema exposed by Claw Router. */
export interface CouponsCatalogListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons catalog list result. */
  data?: CommerceCouponCatalogResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
