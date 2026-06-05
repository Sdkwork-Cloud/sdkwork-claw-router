/** Commerce payment channel item schema exposed by Claw Router. */
export interface CommercePaymentChannelItem {
  /** Channel no field on commerce payment channel item. */
  channelNo: string;
  /** Country code field on commerce payment channel item. */
  countryCode: string;
  /** Created at field on commerce payment channel item. */
  createdAt: string;
  /** Currency code field on commerce payment channel item. */
  currencyCode: string;
  /** Id field on commerce payment channel item. */
  id: string;
  /** Method code field on commerce payment channel item. */
  methodCode: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  /** Priority field on commerce payment channel item. */
  priority: string;
  /** Provider account id field on commerce payment channel item. */
  providerAccountId: string;
  /** Provider code field on commerce payment channel item. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Scene code field on commerce payment channel item. */
  sceneCode: 'checkout' | 'membership_purchase' | 'points_recharge' | 'wallet_recharge' | 'subscription' | 'invoice';
  /** Status field on commerce payment channel item. */
  status: 'active' | 'inactive' | 'disabled';
  /** Updated at field on commerce payment channel item. */
  updatedAt: string;
}
