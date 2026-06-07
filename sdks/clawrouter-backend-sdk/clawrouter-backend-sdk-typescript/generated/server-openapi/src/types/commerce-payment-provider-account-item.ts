/** Commerce payment provider account item schema exposed by Claw Router. */
export interface CommercePaymentProviderAccountItem {
  /** Account no field on commerce payment provider account item. */
  accountNo: string;
  /** Account role field on commerce payment provider account item. */
  accountRole?: 'merchant' | 'service_provider' | null;
  /** Certificate ref field on commerce payment provider account item. */
  certificateRef?: string | null;
  /** Country code field on commerce payment provider account item. */
  countryCode: string;
  /** Created at field on commerce payment provider account item. */
  createdAt: string;
  /** Environment field on commerce payment provider account item. */
  environment: 'sandbox' | 'production';
  /** Id field on commerce payment provider account item. */
  id: string;
  /** Merchant id field on commerce payment provider account item. */
  merchantId: string;
  /** Note field on commerce payment provider account item. */
  note?: string | null;
  /** Provider code field on commerce payment provider account item. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Rotated at field on commerce payment provider account item. */
  rotatedAt?: string | null;
  /** Secret ref field on commerce payment provider account item. */
  secretRef: string;
  /** Settlement currency field on commerce payment provider account item. */
  settlementCurrency: string;
  /** Status field on commerce payment provider account item. */
  status: 'active' | 'inactive' | 'disabled';
  /** Updated at field on commerce payment provider account item. */
  updatedAt: string;
  /** Webhook secret ref field on commerce payment provider account item. */
  webhookSecretRef?: string | null;
}
