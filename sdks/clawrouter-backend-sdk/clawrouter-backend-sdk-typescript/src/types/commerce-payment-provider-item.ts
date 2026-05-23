/** Commerce payment provider item schema exposed by Claw Router. */
export interface CommercePaymentProviderItem {
  /** Capabilities field on commerce payment provider item. */
  capabilities: ('payment_intent' | 'payment_query' | 'payment_close' | 'refund' | 'webhook' | 'reconciliation' | 'tokenization')[];
  /** Created at field on commerce payment provider item. */
  createdAt: string;
  /** Display name field on commerce payment provider item. */
  displayName: string;
  /** Id field on commerce payment provider item. */
  id: string;
  /** Provider code field on commerce payment provider item. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Provider type field on commerce payment provider item. */
  providerType: 'domestic_wallet' | 'international_wallet' | 'card_processor' | 'platform_wallet' | 'account_balance';
  /** Settlement type field on commerce payment provider item. */
  settlementType?: 'direct' | 'aggregator' | 'platform' | null;
  /** Status field on commerce payment provider item. */
  status: 'active' | 'inactive' | 'disabled';
  /** Supported countries field on commerce payment provider item. */
  supportedCountries: string[];
  /** Supported currencies field on commerce payment provider item. */
  supportedCurrencies: string[];
  /** Updated at field on commerce payment provider item. */
  updatedAt: string;
}
