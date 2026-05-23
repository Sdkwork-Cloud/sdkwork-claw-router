import type { MemoryEntryListResponse } from './memory-entry-list-response';

/** Entries list result schema exposed by Claw Router. */
export interface EntriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on entries list result. */
  data?: MemoryEntryListResponse;
  /** Human-readable response message. */
  msg?: string;
}
