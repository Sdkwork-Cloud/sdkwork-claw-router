import type { OpenPlatformEntryResponse } from './open-platform-entry-response';

/** Accounts entries update result schema exposed by Claw Router. */
export interface AccountsEntriesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts entries update result. */
  data?: OpenPlatformEntryResponse;
  /** Human-readable response message. */
  msg?: string;
}
