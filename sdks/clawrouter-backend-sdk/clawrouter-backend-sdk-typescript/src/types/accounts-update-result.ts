import type { OpenPlatformAccountResponse } from './open-platform-account-response';

/** Accounts update result schema exposed by Claw Router. */
export interface AccountsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts update result. */
  data?: OpenPlatformAccountResponse;
  /** Human-readable response message. */
  msg?: string;
}
