import type { OpenPlatformPayBindingListResponse } from './open-platform-pay-binding-list-response';

/** Accounts pay bindings list result schema exposed by Claw Router. */
export interface AccountsPayBindingsListResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts pay bindings list result. */
  data?: OpenPlatformPayBindingListResponse;
  /** Human-readable response message. */
  msg?: string;
}
