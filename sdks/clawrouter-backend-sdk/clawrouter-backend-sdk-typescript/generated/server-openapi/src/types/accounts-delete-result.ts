import type { OpenPlatformAccountResponse } from './open-platform-account-response';

/** Accounts delete result schema exposed by Claw Router. */
export interface AccountsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts delete result. */
  data?: OpenPlatformAccountResponse;
  /** Human-readable response message. */
  msg?: string;
}
