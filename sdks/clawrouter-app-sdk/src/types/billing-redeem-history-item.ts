export interface BillingRedeemHistoryItem {
  /** Redeemed coupon amount as a canonical decimal money string. */
  amount: string;
  code: string;
  date: string;
  id: number;
  status: 'success' | 'pending' | 'failed';
}
