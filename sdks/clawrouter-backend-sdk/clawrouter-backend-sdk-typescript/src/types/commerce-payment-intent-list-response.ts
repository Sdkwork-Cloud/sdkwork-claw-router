import type { CommercePaymentIntentItem } from './commerce-payment-intent-item';

/** Commerce payment intent list response schema exposed by Claw Router. */
export interface CommercePaymentIntentListResponse {
  /** Items field on commerce payment intent list response. */
  items: CommercePaymentIntentItem[];
  /** Page field on commerce payment intent list response. */
  page: string;
  /** Page size field on commerce payment intent list response. */
  pageSize: string;
  /** Total field on commerce payment intent list response. */
  total: string;
}
