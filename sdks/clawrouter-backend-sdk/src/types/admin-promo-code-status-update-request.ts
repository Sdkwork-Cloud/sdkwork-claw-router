export interface AdminPromoCodeStatusUpdateRequest {
  /** New promo code lifecycle status. */
  status: 'available' | 'claimed' | 'used' | 'voided';
}
