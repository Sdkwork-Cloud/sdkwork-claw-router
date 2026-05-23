import type { CommercePaymentProviderAccountItem } from './commerce-payment-provider-account-item';

/** Commerce payment provider account list response schema exposed by Claw Router. */
export interface CommercePaymentProviderAccountListResponse {
  /** Items field on commerce payment provider account list response. */
  items: CommercePaymentProviderAccountItem[];
  /** Page field on commerce payment provider account list response. */
  page: number;
  /** Page size field on commerce payment provider account list response. */
  pageSize: number;
  /** Total field on commerce payment provider account list response. */
  total: number;
}
