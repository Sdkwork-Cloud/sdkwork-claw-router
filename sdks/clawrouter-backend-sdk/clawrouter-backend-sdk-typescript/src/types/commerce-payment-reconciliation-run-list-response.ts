import type { CommercePaymentReconciliationRunItem } from './commerce-payment-reconciliation-run-item';

/** Commerce payment reconciliation run list response schema exposed by Claw Router. */
export interface CommercePaymentReconciliationRunListResponse {
  /** Items field on commerce payment reconciliation run list response. */
  items: CommercePaymentReconciliationRunItem[];
  /** Page field on commerce payment reconciliation run list response. */
  page: string;
  /** Page size field on commerce payment reconciliation run list response. */
  pageSize: string;
  /** Total field on commerce payment reconciliation run list response. */
  total: string;
}
