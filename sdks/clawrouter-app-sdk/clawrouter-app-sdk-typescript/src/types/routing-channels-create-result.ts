import type { RoutingChannelMutationResponse } from './routing-channel-mutation-response';

/** Routing channels create result schema exposed by Claw Router. */
export interface RoutingChannelsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on routing channels create result. */
  data?: RoutingChannelMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
