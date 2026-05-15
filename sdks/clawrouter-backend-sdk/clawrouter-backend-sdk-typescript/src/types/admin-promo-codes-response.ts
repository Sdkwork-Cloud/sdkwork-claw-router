import type { AdminPromoCodeItem } from './admin-promo-code-item';

/** Admin promo codes response schema exposed by Claw Router. */
export interface AdminPromoCodesResponse {
  /** Items field on admin promo codes response. */
  items: AdminPromoCodeItem[];
}
