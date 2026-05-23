/** Commerce payment provider account mutation request schema exposed by Claw Router. */
export interface CommercePaymentProviderAccountMutationRequest {
  /** Account no field on commerce payment provider account mutation request. */
  accountNo: string;
  /** Certificate ref field on commerce payment provider account mutation request. */
  certificateRef?: string | null;
  /** Client request no field on commerce payment provider account mutation request. */
  clientRequestNo?: string;
  /** Country code field on commerce payment provider account mutation request. */
  countryCode: string;
  /** Environment field on commerce payment provider account mutation request. */
  environment: 'sandbox' | 'production';
  /** Merchant id field on commerce payment provider account mutation request. */
  merchantId: string;
  /** Note field on commerce payment provider account mutation request. */
  note?: string | null;
  /** Provider code field on commerce payment provider account mutation request. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Rotated at field on commerce payment provider account mutation request. */
  rotatedAt?: string | null;
  /** Secret ref field on commerce payment provider account mutation request. */
  secretRef: string;
  /** Settlement currency field on commerce payment provider account mutation request. */
  settlementCurrency: string;
  /** Status field on commerce payment provider account mutation request. */
  status: 'active' | 'inactive' | 'disabled';
  /** Webhook secret ref field on commerce payment provider account mutation request. */
  webhookSecretRef?: string | null;
}
