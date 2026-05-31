/** Commerce payment runtime assembly summary schema exposed by Claw Router. */
export interface CommercePaymentRuntimeAssemblySummary {
  /** Failed field on commerce payment runtime assembly summary. */
  failed: number;
  /** Failed provider codes field on commerce payment runtime assembly summary. */
  failedProviderCodes: ('wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay')[];
  /** Registered field on commerce payment runtime assembly summary. */
  registered: number;
  /** Registered provider codes field on commerce payment runtime assembly summary. */
  registeredProviderCodes: ('wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay')[];
  /** Skipped field on commerce payment runtime assembly summary. */
  skipped: number;
  /** Skipped provider codes field on commerce payment runtime assembly summary. */
  skippedProviderCodes: ('wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay')[];
  /** Total field on commerce payment runtime assembly summary. */
  total: number;
}
