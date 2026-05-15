import type { AdminChannelMutationResponse } from './admin-channel-mutation-response';

/** Channels update result schema exposed by Claw Router. */
export interface ChannelsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on channels update result. */
  data?: AdminChannelMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
