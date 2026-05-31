import type { CommercePaymentRuntimeSnapshotResponse } from './commerce-payment-runtime-snapshot-response';

/** Payments runtime snapshot retrieve result schema exposed by Claw Router. */
export interface PaymentsRuntimeSnapshotRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on payments runtime snapshot retrieve result. */
  data?: CommercePaymentRuntimeSnapshotResponse;
  /** Human-readable response message. */
  msg?: string;
}
