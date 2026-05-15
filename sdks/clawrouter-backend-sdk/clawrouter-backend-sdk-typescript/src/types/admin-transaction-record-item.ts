/** Admin transaction record item schema exposed by Claw Router. */
export interface AdminTransactionRecordItem {
  /** Amount field on admin transaction record item. */
  amount: string;
  /** Balance field on admin transaction record item. */
  balance: string;
  /** Description field on admin transaction record item. */
  description: string;
  /** Id field on admin transaction record item. */
  id: string;
  /** Status field on admin transaction record item. */
  status: 'success' | 'failed' | 'pending';
  /** Time field on admin transaction record item. */
  time: string;
  /** Type field on admin transaction record item. */
  type: 'recharge' | 'refund' | 'consume';
  /** User id field on admin transaction record item. */
  userId: string;
}
