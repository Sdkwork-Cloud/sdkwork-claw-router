/** Commerce points history item schema exposed by Claw Router. */
export interface CommercePointsHistoryItem {
  /** Amount field on commerce points history item. */
  amount: number;
  /** Balance after field on commerce points history item. */
  balanceAfter: number;
  /** Business type field on commerce points history item. */
  businessType: string;
  /** Created at field on commerce points history item. */
  createdAt: string;
  /** Direction field on commerce points history item. */
  direction: 'in' | 'out';
  /** Id field on commerce points history item. */
  id: string;
}
