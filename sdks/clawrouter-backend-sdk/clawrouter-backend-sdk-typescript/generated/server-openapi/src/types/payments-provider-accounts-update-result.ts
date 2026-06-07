import type { CommercePaymentProviderAccountMutationResponse } from './commerce-payment-provider-account-mutation-response';

/** Payments provider accounts update result schema exposed by Claw Router. */
export interface PaymentsProviderAccountsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on payments provider accounts update result. */
  data?: CommercePaymentProviderAccountMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
