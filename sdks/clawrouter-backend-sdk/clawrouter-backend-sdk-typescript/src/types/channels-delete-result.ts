import type { AdminDeleteResponse } from './admin-delete-response';

/** Channels delete result schema exposed by Claw Router. */
export interface ChannelsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on channels delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
