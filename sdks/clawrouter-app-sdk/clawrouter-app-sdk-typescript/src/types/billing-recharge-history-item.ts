/** Billing recharge history item schema exposed by Claw Router. */
export interface BillingRechargeHistoryItem {
  /** Recharge payment amount as a canonical decimal money string. */
  amount: string;
  /** Date field on billing recharge history item. */
  date: string;
  /** Id field on billing recharge history item. */
  id: number;
  /** Method field on billing recharge history item. */
  method: string;
  /** Order no field on billing recharge history item. */
  orderNo: string;
  /** Status field on billing recharge history item. */
  status: 'success' | 'pending' | 'failed';
}
