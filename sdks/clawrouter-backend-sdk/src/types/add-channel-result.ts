import type { AdminChannelMutationResponse } from './admin-channel-mutation-response';

export interface AddChannelResult {
  /** Business response code. */
  code: string;
  data?: AdminChannelMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
