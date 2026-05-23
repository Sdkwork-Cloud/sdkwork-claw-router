/** Commerce payment attempt create request schema exposed by Claw Router. */
export interface CommercePaymentAttemptCreateRequest {
  /** Client request no field on commerce payment attempt create request. */
  clientRequestNo?: string;
  /** Method code field on commerce payment attempt create request. */
  methodCode: 'wechat_pay' | 'alipay' | 'paypal' | 'card' | 'apple_pay' | 'google_pay' | 'wallet_balance';
  /** Note field on commerce payment attempt create request. */
  note?: string | null;
  /** Provider code field on commerce payment attempt create request. */
  providerCode?: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay' | null;
  /** Return url field on commerce payment attempt create request. */
  returnUrl?: string | null;
}
