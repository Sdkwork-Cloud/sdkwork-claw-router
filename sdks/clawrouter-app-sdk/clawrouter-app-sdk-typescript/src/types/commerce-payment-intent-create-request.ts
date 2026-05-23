/** Commerce payment intent create request schema exposed by Claw Router. */
export interface CommercePaymentIntentCreateRequest {
  /** Amount field on commerce payment intent create request. */
  amount: string;
  /** Checkout session id field on commerce payment intent create request. */
  checkoutSessionId?: string | null;
  /** Client request no field on commerce payment intent create request. */
  clientRequestNo?: string;
  /** Currency code field on commerce payment intent create request. */
  currencyCode: string;
  /** Method code field on commerce payment intent create request. */
  methodCode: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  /** Note field on commerce payment intent create request. */
  note?: string | null;
  /** Order id field on commerce payment intent create request. */
  orderId: string;
  /** Subject type field on commerce payment intent create request. */
  subjectType: 'order' | 'membership_purchase' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'invoice';
}
