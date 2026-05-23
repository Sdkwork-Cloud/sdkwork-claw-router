/** Commerce payment intent item schema exposed by Claw Router. */
export interface CommercePaymentIntentItem {
  /** Amount field on commerce payment intent item. */
  amount: string;
  /** Checkout session id field on commerce payment intent item. */
  checkoutSessionId?: string | null;
  /** Created at field on commerce payment intent item. */
  createdAt: string;
  /** Currency code field on commerce payment intent item. */
  currencyCode: string;
  /** Id field on commerce payment intent item. */
  id: string;
  /** Intent no field on commerce payment intent item. */
  intentNo: string;
  /** Method code field on commerce payment intent item. */
  methodCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance' | null;
  /** Order id field on commerce payment intent item. */
  orderId: string;
  /** Provider code field on commerce payment intent item. */
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay' | null;
  /** Status field on commerce payment intent item. */
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'expired' | 'refunding' | 'refunded';
  /** Subject type field on commerce payment intent item. */
  subjectType: 'order' | 'membership_purchase' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'invoice';
  /** Updated at field on commerce payment intent item. */
  updatedAt: string;
}
