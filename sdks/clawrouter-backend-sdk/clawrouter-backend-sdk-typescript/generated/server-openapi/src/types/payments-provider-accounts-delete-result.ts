import type { CommercePaymentProviderAccountDeleteResponse } from './commerce-payment-provider-account-delete-response';

/** Payments provider accounts delete result schema exposed by Claw Router. */
export interface PaymentsProviderAccountsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on payments provider accounts delete result. */
  data?: CommercePaymentProviderAccountDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
