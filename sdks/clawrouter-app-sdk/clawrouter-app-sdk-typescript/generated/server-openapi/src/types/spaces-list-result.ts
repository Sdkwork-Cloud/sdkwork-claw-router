import type { MemorySpaceListResponse } from './memory-space-list-response';

/** Spaces list result schema exposed by Claw Router. */
export interface SpacesListResult {
  /** Business response code. */
  code: string;
  /** Data field on spaces list result. */
  data?: MemorySpaceListResponse;
  /** Human-readable response message. */
  msg?: string;
}
