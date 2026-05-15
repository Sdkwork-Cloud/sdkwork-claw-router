import type { RoutingChannelMutationResponse } from './routing-channel-mutation-response';

/** Routing channels status update result schema exposed by Claw Router. */
export interface RoutingChannelsStatusUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on routing channels status update result. */
  data?: RoutingChannelMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
