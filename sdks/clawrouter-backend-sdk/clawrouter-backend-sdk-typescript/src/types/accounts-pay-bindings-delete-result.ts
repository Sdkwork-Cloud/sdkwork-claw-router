import type { OpenPlatformPayBindingResponse } from './open-platform-pay-binding-response';

/** Accounts pay bindings delete result schema exposed by Claw Router. */
export interface AccountsPayBindingsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts pay bindings delete result. */
  data?: OpenPlatformPayBindingResponse;
  /** Human-readable response message. */
  msg?: string;
}
