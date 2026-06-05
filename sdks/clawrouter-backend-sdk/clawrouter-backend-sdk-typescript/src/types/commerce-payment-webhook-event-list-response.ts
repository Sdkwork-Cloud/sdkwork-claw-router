import type { CommercePaymentWebhookEventItem } from './commerce-payment-webhook-event-item';

/** Commerce payment webhook event list response schema exposed by Claw Router. */
export interface CommercePaymentWebhookEventListResponse {
  /** Items field on commerce payment webhook event list response. */
  items: CommercePaymentWebhookEventItem[];
  /** Page field on commerce payment webhook event list response. */
  page: string;
  /** Page size field on commerce payment webhook event list response. */
  pageSize: string;
  /** Total field on commerce payment webhook event list response. */
  total: string;
}
