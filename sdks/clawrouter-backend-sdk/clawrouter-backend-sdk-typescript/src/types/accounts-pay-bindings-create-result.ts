import type { OpenPlatformPayBindingResponse } from './open-platform-pay-binding-response';

/** Accounts pay bindings create result schema exposed by Claw Router. */
export interface AccountsPayBindingsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts pay bindings create result. */
  data?: OpenPlatformPayBindingResponse;
  /** Human-readable response message. */
  msg?: string;
}
