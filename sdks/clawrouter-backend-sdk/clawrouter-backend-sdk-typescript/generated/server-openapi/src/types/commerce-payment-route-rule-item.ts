/** Commerce payment route rule item schema exposed by Claw Router. */
export interface CommercePaymentRouteRuleItem {
  /** Channel id field on commerce payment route rule item. */
  channelId?: string | null;
  /** Country code field on commerce payment route rule item. */
  countryCode: string;
  /** Created at field on commerce payment route rule item. */
  createdAt: string;
  /** Currency code field on commerce payment route rule item. */
  currencyCode: string;
  /** Fallback channel id field on commerce payment route rule item. */
  fallbackChannelId?: string | null;
  /** Fallback enabled field on commerce payment route rule item. */
  fallbackEnabled: boolean;
  /** Id field on commerce payment route rule item. */
  id: string;
  /** Method code field on commerce payment route rule item. */
  methodCode: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  /** Priority field on commerce payment route rule item. */
  priority: string;
  /** Rule no field on commerce payment route rule item. */
  ruleNo: string;
  /** Scene code field on commerce payment route rule item. */
  sceneCode: 'checkout' | 'membership_purchase' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'invoice';
  /** Status field on commerce payment route rule item. */
  status: 'active' | 'inactive' | 'disabled';
  /** Updated at field on commerce payment route rule item. */
  updatedAt: string;
}
