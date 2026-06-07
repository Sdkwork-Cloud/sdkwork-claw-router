import type { CommercePaymentAttemptItem } from './commerce-payment-attempt-item';

/** Commerce payment attempt list response schema exposed by Claw Router. */
export interface CommercePaymentAttemptListResponse {
  /** Items field on commerce payment attempt list response. */
  items: CommercePaymentAttemptItem[];
  /** Page field on commerce payment attempt list response. */
  page: string;
  /** Page size field on commerce payment attempt list response. */
  pageSize: string;
  /** Total field on commerce payment attempt list response. */
  total: string;
}
