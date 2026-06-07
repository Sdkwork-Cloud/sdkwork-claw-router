import type { CommercePaymentProviderAccountMutationResponse } from './commerce-payment-provider-account-mutation-response';

/** Payments provider accounts create result schema exposed by Claw Router. */
export interface PaymentsProviderAccountsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on payments provider accounts create result. */
  data?: CommercePaymentProviderAccountMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
