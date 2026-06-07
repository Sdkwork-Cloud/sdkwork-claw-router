/** Commerce payment webhook event item schema exposed by Claw Router. */
export interface CommercePaymentWebhookEventItem {
  /** Event no field on commerce payment webhook event item. */
  eventNo: string;
  /** Event type field on commerce payment webhook event item. */
  eventType: string;
  /** External event id field on commerce payment webhook event item. */
  externalEventId?: string | null;
  /** Id field on commerce payment webhook event item. */
  id: string;
  /** Process status field on commerce payment webhook event item. */
  processStatus: 'received' | 'verified' | 'processed' | 'ignored' | 'failed';
  /** Processed at field on commerce payment webhook event item. */
  processedAt?: string | null;
  /** Provider code field on commerce payment webhook event item. */
  providerCode: 'wechat_pay' | 'alipay' | 'paypal' | 'stripe' | 'apple_pay' | 'google_pay';
  /** Received at field on commerce payment webhook event item. */
  receivedAt: string;
}
