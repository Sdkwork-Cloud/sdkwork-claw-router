/** Commerce payment attempt item schema exposed by Claw Router. */
export interface CommercePaymentAttemptItem {
  /** Amount field on commerce payment attempt item. */
  amount: string;
  /** Attempt no field on commerce payment attempt item. */
  attemptNo: string;
  /** Created at field on commerce payment attempt item. */
  createdAt: string;
  /** Currency code field on commerce payment attempt item. */
  currencyCode: string;
  /** External trade no field on commerce payment attempt item. */
  externalTradeNo?: string | null;
  /** Id field on commerce payment attempt item. */
  id: string;
  /** Intent id field on commerce payment attempt item. */
  intentId: string;
  /** Method code field on commerce payment attempt item. */
  methodCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  /** Paid at field on commerce payment attempt item. */
  paidAt?: string | null;
  /** Provider code field on commerce payment attempt item. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Status field on commerce payment attempt item. */
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'expired' | 'refunding' | 'refunded';
  /** Updated at field on commerce payment attempt item. */
  updatedAt?: string | null;
}
