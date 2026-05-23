/** Commerce payment reconciliation run item schema exposed by Claw Router. */
export interface CommercePaymentReconciliationRunItem {
  /** Business date field on commerce payment reconciliation run item. */
  businessDate: string;
  /** Created at field on commerce payment reconciliation run item. */
  createdAt: string;
  /** Finished at field on commerce payment reconciliation run item. */
  finishedAt?: string | null;
  /** Id field on commerce payment reconciliation run item. */
  id: string;
  /** Provider code field on commerce payment reconciliation run item. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Run no field on commerce payment reconciliation run item. */
  runNo: string;
  /** Status field on commerce payment reconciliation run item. */
  status: 'pending' | 'running' | 'succeeded' | 'failed' | 'canceled';
}
