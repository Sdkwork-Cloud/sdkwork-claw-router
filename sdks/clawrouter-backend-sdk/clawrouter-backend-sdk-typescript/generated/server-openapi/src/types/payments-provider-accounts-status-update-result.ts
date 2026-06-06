import type { CommercePaymentProviderAccountMutationResponse } from './commerce-payment-provider-account-mutation-response';

/** Payments provider accounts status update result schema exposed by Claw Router. */
export interface PaymentsProviderAccountsStatusUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on payments provider accounts status update result. */
  data?: CommercePaymentProviderAccountMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
