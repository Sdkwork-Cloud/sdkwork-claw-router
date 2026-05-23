import type { RoutingChannelDeleteResponse } from './routing-channel-delete-response';

/** Routing channels delete result schema exposed by Claw Router. */
export interface RoutingChannelsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on routing channels delete result. */
  data?: RoutingChannelDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
