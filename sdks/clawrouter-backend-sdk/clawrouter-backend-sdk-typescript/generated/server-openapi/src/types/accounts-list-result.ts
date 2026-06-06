import type { OpenPlatformAccountListResponse } from './open-platform-account-list-response';

/** Accounts list result schema exposed by Claw Router. */
export interface AccountsListResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts list result. */
  data?: OpenPlatformAccountListResponse;
  /** Human-readable response message. */
  msg?: string;
}
