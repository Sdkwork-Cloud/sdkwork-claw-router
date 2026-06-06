import type { MemorySpaceItem } from './memory-space-item';

/** Spaces retrieve result schema exposed by Claw Router. */
export interface SpacesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on spaces retrieve result. */
  data?: MemorySpaceItem;
  /** Human-readable response message. */
  msg?: string;
}
