import type { CommercePaymentIntentItem } from './commerce-payment-intent-item';

/** Commerce payment intent list response schema exposed by Claw Router. */
export interface CommercePaymentIntentListResponse {
  /** Items field on commerce payment intent list response. */
  items: CommercePaymentIntentItem[];
  /** Page field on commerce payment intent list response. */
  page: number;
  /** Page size field on commerce payment intent list response. */
  pageSize: number;
  /** Total field on commerce payment intent list response. */
  total: number;
}
