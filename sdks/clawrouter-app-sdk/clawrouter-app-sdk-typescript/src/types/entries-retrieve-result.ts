import type { MemoryEntryItem } from './memory-entry-item';

/** Entries retrieve result schema exposed by Claw Router. */
export interface EntriesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on entries retrieve result. */
  data?: MemoryEntryItem;
  /** Human-readable response message. */
  msg?: string;
}
