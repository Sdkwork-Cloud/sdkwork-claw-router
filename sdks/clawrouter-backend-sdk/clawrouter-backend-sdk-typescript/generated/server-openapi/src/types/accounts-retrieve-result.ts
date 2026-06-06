import type { OpenPlatformAccountResponse } from './open-platform-account-response';

/** Accounts retrieve result schema exposed by Claw Router. */
export interface AccountsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts retrieve result. */
  data?: OpenPlatformAccountResponse;
  /** Human-readable response message. */
  msg?: string;
}
