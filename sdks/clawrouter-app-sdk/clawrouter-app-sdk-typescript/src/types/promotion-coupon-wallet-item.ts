/** Promotion coupon wallet item schema exposed by Claw Router. */
export interface PromotionCouponWalletItem {
  /** Claim source field on promotion coupon wallet item. */
  claimSource: string;
  /** Claimed at field on promotion coupon wallet item. */
  claimedAt: string;
  /** Code id field on promotion coupon wallet item. */
  codeId?: string | null;
  /** Coupon no field on promotion coupon wallet item. */
  couponNo: string;
  /** Currency code field on promotion coupon wallet item. */
  currencyCode: string;
  /** Discount type field on promotion coupon wallet item. */
  discountType?: string | null;
  /** Expires at field on promotion coupon wallet item. */
  expiresAt: string;
  /** Face value minor field on promotion coupon wallet item. */
  faceValueMinor?: number | null;
  /** Stable promotion_user_coupon id. */
  id: string;
  /** Lock expires at field on promotion coupon wallet item. */
  lockExpiresAt?: string | null;
  /** Locked at field on promotion coupon wallet item. */
  lockedAt?: string | null;
  /** Offer id field on promotion coupon wallet item. */
  offerId: string;
  /** Redeemed at field on promotion coupon wallet item. */
  redeemedAt?: string | null;
  /** Returned at field on promotion coupon wallet item. */
  returnedAt?: string | null;
  /** Source code last 4 field on promotion coupon wallet item. */
  sourceCodeLast4?: string | null;
  /** Status field on promotion coupon wallet item. */
  status: 'available' | 'locked' | 'redeemed' | 'expired' | 'disabled' | 'returned';
  /** Stock id field on promotion coupon wallet item. */
  stockId: string;
  /** Valid from field on promotion coupon wallet item. */
  validFrom: string;
}
