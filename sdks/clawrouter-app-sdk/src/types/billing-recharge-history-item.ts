export interface BillingRechargeHistoryItem {
  /** Recharge payment amount as a canonical decimal money string. */
  amount: string;
  date: string;
  id: number;
  method: string;
  orderNo: string;
  status: 'success' | 'pending' | 'failed';
}
