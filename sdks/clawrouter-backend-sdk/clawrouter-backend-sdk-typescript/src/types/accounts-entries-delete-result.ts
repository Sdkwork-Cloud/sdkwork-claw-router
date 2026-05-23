import type { OpenPlatformEntryResponse } from './open-platform-entry-response';

/** Accounts entries delete result schema exposed by Claw Router. */
export interface AccountsEntriesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on accounts entries delete result. */
  data?: OpenPlatformEntryResponse;
  /** Human-readable response message. */
  msg?: string;
}
