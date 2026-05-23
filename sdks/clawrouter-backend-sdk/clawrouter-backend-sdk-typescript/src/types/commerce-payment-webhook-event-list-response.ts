import type { CommercePaymentWebhookEventItem } from './commerce-payment-webhook-event-item';

/** Commerce payment webhook event list response schema exposed by Claw Router. */
export interface CommercePaymentWebhookEventListResponse {
  /** Items field on commerce payment webhook event list response. */
  items: CommercePaymentWebhookEventItem[];
  /** Page field on commerce payment webhook event list response. */
  page: number;
  /** Page size field on commerce payment webhook event list response. */
  pageSize: number;
  /** Total field on commerce payment webhook event list response. */
  total: number;
}
