import type { CommercePaymentProviderAccountListResponse } from './commerce-payment-provider-account-list-response';

/** Payments provider accounts list result schema exposed by Claw Router. */
export interface PaymentsProviderAccountsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments provider accounts list result. */
  data?: CommercePaymentProviderAccountListResponse;
  /** Human-readable response message. */
  msg?: string;
}
