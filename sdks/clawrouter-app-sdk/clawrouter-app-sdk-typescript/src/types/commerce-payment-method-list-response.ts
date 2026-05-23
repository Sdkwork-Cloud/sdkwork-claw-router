import type { CommercePaymentMethodItem } from './commerce-payment-method-item';

/** Commerce payment method list response schema exposed by Claw Router. */
export interface CommercePaymentMethodListResponse {
  /** Items field on commerce payment method list response. */
  items: CommercePaymentMethodItem[];
  /** Page field on commerce payment method list response. */
  page: number;
  /** Page size field on commerce payment method list response. */
  pageSize: number;
  /** Total field on commerce payment method list response. */
  total: number;
}
