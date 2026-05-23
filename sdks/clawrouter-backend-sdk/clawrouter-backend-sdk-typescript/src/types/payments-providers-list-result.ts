import type { CommercePaymentProviderListResponse } from './commerce-payment-provider-list-response';

/** Payments providers list result schema exposed by Claw Router. */
export interface PaymentsProvidersListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments providers list result. */
  data?: CommercePaymentProviderListResponse;
  /** Human-readable response message. */
  msg?: string;
}
