import type { CommercePaymentReconciliationRunListResponse } from './commerce-payment-reconciliation-run-list-response';

/** Payments reconciliation runs list result schema exposed by Claw Router. */
export interface PaymentsReconciliationRunsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments reconciliation runs list result. */
  data?: CommercePaymentReconciliationRunListResponse;
  /** Human-readable response message. */
  msg?: string;
}
