/** Admin promo code status update request schema exposed by Claw Router. */
export interface AdminPromoCodeStatusUpdateRequest {
  /** New promo code lifecycle status. */
  status: 'available' | 'claimed' | 'used' | 'voided';
}
