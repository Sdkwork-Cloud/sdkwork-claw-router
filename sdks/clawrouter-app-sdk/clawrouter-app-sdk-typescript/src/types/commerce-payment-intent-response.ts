import type { CommercePaymentIntentItem } from './commerce-payment-intent-item';

/** Commerce payment intent response schema exposed by Claw Router. */
export interface CommercePaymentIntentResponse {
  /** Item field on commerce payment intent response. */
  item: CommercePaymentIntentItem;
}
