import type { CommercePaymentAttemptItem } from './commerce-payment-attempt-item';

/** Commerce payment attempt response schema exposed by Claw Router. */
export interface CommercePaymentAttemptResponse {
  /** Item field on commerce payment attempt response. */
  item: CommercePaymentAttemptItem;
}
