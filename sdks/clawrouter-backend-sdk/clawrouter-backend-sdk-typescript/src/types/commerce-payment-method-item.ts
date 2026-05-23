/** Commerce payment method item schema exposed by Claw Router. */
export interface CommercePaymentMethodItem {
  /** Checkout scenes field on commerce payment method item. */
  checkoutScenes: ('checkout' | 'membership_purchase' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'invoice')[];
  /** Created at field on commerce payment method item. */
  createdAt: string;
  /** Display name field on commerce payment method item. */
  displayName: string;
  /** Id field on commerce payment method item. */
  id: string;
  /** Method code field on commerce payment method item. */
  methodCode: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  /** Method type field on commerce payment method item. */
  methodType: 'domestic_wallet' | 'international_wallet' | 'card' | 'platform_wallet' | 'account_balance';
  /** Provider code field on commerce payment method item. */
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay' | null;
  /** Sort order field on commerce payment method item. */
  sortOrder: number;
  /** Status field on commerce payment method item. */
  status: 'active' | 'inactive' | 'disabled';
  /** Updated at field on commerce payment method item. */
  updatedAt: string;
}
