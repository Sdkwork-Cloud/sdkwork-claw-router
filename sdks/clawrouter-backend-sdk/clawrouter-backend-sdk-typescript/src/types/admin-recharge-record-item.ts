/** Admin recharge record item schema exposed by Claw Router. */
export interface AdminRechargeRecordItem {
  /** Amount field on admin recharge record item. */
  amount: string;
  /** Id field on admin recharge record item. */
  id: string;
  /** Method field on admin recharge record item. */
  method: string;
  /** Status field on admin recharge record item. */
  status: 'success' | 'pending' | 'failed' | 'closed';
  /** Time field on admin recharge record item. */
  time: string;
  /** Trade no field on admin recharge record item. */
  tradeNo: string;
  /** Usd credited field on admin recharge record item. */
  usd_credited: string;
  /** User field on admin recharge record item. */
  user: string;
  /** User id field on admin recharge record item. */
  userId: string;
}
