export interface RedeemCodeResponse {
  /** Redeemed coupon amount as a canonical decimal money string. */
  amount: string;
  balance: number;
  creditedPoints: number;
  message: string;
}
