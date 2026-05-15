/** Admin billing record item schema exposed by Claw Router. */
export interface AdminBillingRecordItem {
  /** Due date field on admin billing record item. */
  dueDate: string;
  /** Id field on admin billing record item. */
  id: string;
  /** Period field on admin billing record item. */
  period: string;
  /** Status field on admin billing record item. */
  status: 'paid' | 'unpaid' | 'overdue';
  /** Total cost field on admin billing record item. */
  totalCost: string;
  /** Total tokens field on admin billing record item. */
  totalTokens: number;
  /** User id field on admin billing record item. */
  userId: string;
}
