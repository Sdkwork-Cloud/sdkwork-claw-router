import type { MemorySpaceResponse } from './memory-space-response';

/** Spaces create result schema exposed by Claw Router. */
export interface SpacesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on spaces create result. */
  data?: MemorySpaceResponse;
  /** Human-readable response message. */
  msg?: string;
}
