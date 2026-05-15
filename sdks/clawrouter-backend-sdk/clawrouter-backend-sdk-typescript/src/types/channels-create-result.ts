import type { AdminChannelMutationResponse } from './admin-channel-mutation-response';

/** Channels create result schema exposed by Claw Router. */
export interface ChannelsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on channels create result. */
  data?: AdminChannelMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
