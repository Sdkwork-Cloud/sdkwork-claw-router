import type { OpenPlatformEntryListResponse } from './open-platform-entry-list-response';

/** Accounts entries list result schema exposed by Claw Router. */
export interface AccountsEntriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts entries list result. */
  data?: OpenPlatformEntryListResponse;
  /** Human-readable response message. */
  msg?: string;
}
