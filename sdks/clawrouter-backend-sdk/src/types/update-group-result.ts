import type { AdminAccessGroupMutationResponse } from './admin-access-group-mutation-response';

export interface UpdateGroupResult {
  /** Business response code. */
  code: string;
  data?: AdminAccessGroupMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
