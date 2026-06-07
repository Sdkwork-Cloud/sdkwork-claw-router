import type { CommercePaymentWebhookEventListResponse } from './commerce-payment-webhook-event-list-response';

/** Payments webhook events list result schema exposed by Claw Router. */
export interface PaymentsWebhookEventsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments webhook events list result. */
  data?: CommercePaymentWebhookEventListResponse;
  /** Human-readable response message. */
  msg?: string;
}
