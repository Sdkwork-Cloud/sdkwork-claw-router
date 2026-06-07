import type { CommercePaymentMethodListResponse } from './commerce-payment-method-list-response';

/** Payments methods list result schema exposed by Claw Router. */
export interface PaymentsMethodsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments methods list result. */
  data?: CommercePaymentMethodListResponse;
  /** Human-readable response message. */
  msg?: string;
}
