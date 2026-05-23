import type { MemoryEntryResponse } from './memory-entry-response';

/** Entries create result schema exposed by Claw Router. */
export interface EntriesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on entries create result. */
  data?: MemoryEntryResponse;
  /** Human-readable response message. */
  msg?: string;
}
