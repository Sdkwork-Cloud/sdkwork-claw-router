/** Billing redeem history item schema exposed by Claw Router. */
export interface BillingRedeemHistoryItem {
  /** Redeemed coupon amount as a canonical decimal money string. */
  amount: string;
  /** Code field on billing redeem history item. */
  code: string;
  /** Date field on billing redeem history item. */
  date: string;
  /** Id field on billing redeem history item. */
  id: number;
  /** Status field on billing redeem history item. */
  status: 'success' | 'pending' | 'failed';
}
