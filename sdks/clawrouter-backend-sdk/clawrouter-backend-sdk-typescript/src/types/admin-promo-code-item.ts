/** Admin promo code item schema exposed by Claw Router. */
export interface AdminPromoCodeItem {
  /** Batch id field on admin promo code item. */
  batchId: string;
  /** Code field on admin promo code item. */
  code: string;
  /** Id field on admin promo code item. */
  id: string;
  /** Status field on admin promo code item. */
  status: 'available' | 'claimed' | 'used' | 'voided';
  /** Used at field on admin promo code item. */
  usedAt?: string;
  /** Used by field on admin promo code item. */
  usedBy?: string;
}
