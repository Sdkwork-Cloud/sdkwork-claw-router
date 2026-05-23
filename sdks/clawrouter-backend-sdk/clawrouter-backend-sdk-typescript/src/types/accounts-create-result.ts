import type { OpenPlatformAccountResponse } from './open-platform-account-response';

/** Accounts create result schema exposed by Claw Router. */
export interface AccountsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts create result. */
  data?: OpenPlatformAccountResponse;
  /** Human-readable response message. */
  msg?: string;
}
