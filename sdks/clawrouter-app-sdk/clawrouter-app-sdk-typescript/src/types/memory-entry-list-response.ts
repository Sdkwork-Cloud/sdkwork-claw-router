import type { MemoryEntryItem } from './memory-entry-item';

/** Memory entry list response schema exposed by Claw Router. */
export interface MemoryEntryListResponse {
  /** Items field on memory entry list response. */
  items: MemoryEntryItem[];
}
