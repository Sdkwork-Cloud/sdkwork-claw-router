/** Commerce payment runtime assembly event schema exposed by Claw Router. */
export interface CommercePaymentRuntimeAssemblyEvent {
  /** Account no field on commerce payment runtime assembly event. */
  accountNo: string;
  /** Kind field on commerce payment runtime assembly event. */
  kind: 'registered' | 'failed' | 'skipped';
  /** Message field on commerce payment runtime assembly event. */
  message?: string | null;
  /** Provider code field on commerce payment runtime assembly event. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Reason field on commerce payment runtime assembly event. */
  reason?: string | null;
}
