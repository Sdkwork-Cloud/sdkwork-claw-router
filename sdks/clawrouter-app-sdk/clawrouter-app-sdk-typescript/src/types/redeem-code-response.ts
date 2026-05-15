/** Redeem code response schema exposed by Claw Router. */
export interface RedeemCodeResponse {
  /** Redeemed coupon amount as a canonical decimal money string. */
  amount: string;
  /** Balance field on redeem code response. */
  balance: number;
  /** Credited points field on redeem code response. */
  creditedPoints: number;
  /** Message field on redeem code response. */
  message: string;
}
