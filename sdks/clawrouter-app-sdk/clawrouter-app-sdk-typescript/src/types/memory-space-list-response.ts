import type { MemorySpaceItem } from './memory-space-item';

/** Memory space list response schema exposed by Claw Router. */
export interface MemorySpaceListResponse {
  /** Items field on memory space list response. */
  items: MemorySpaceItem[];
}
