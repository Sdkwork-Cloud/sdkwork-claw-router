import type { CommercePaymentProviderItem } from './commerce-payment-provider-item';

/** Commerce payment provider list response schema exposed by Claw Router. */
export interface CommercePaymentProviderListResponse {
  /** Items field on commerce payment provider list response. */
  items: CommercePaymentProviderItem[];
  /** Page field on commerce payment provider list response. */
  page: number;
  /** Page size field on commerce payment provider list response. */
  pageSize: number;
  /** Total field on commerce payment provider list response. */
  total: number;
}
