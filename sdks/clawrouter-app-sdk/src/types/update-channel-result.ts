import type { RoutingChannelMutationResponse } from './routing-channel-mutation-response';

export interface UpdateChannelResult {
  /** Business response code. */
  code: string;
  data?: RoutingChannelMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
