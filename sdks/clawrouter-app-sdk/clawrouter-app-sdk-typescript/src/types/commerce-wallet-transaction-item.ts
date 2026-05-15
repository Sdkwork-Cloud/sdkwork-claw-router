/** Commerce wallet transaction item schema exposed by Claw Router. */
export interface CommerceWalletTransactionItem {
  /** Amount field on commerce wallet transaction item. */
  amount: string;
  /** Balance after field on commerce wallet transaction item. */
  balanceAfter: string;
  /** Business type field on commerce wallet transaction item. */
  businessType: string;
  /** Created at field on commerce wallet transaction item. */
  createdAt: string;
  /** Direction field on commerce wallet transaction item. */
  direction: 'in' | 'out';
  /** Id field on commerce wallet transaction item. */
  id: string;
  /** Transaction no field on commerce wallet transaction item. */
  transactionNo: string;
}
