import type { MemoryEntryItem } from './memory-entry-item';

/** Memory entry response schema exposed by Claw Router. */
export interface MemoryEntryResponse {
  /** Item field on memory entry response. */
  item: MemoryEntryItem;
}
