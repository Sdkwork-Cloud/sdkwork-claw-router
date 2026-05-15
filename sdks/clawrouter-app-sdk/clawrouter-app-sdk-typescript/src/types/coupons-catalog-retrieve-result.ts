import type { CommerceCouponCatalogItem } from './commerce-coupon-catalog-item';

/** Coupons catalog retrieve result schema exposed by Claw Router. */
export interface CouponsCatalogRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons catalog retrieve result. */
  data?: CommerceCouponCatalogItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
