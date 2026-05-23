import type { RoutingChannelTestResponse } from './routing-channel-test-response';

/** Routing channels verify result schema exposed by Claw Router. */
export interface RoutingChannelsVerifyResult {
  /** Business response code. */
  code: string;
  /** Data field on routing channels verify result. */
  data?: RoutingChannelTestResponse;
  /** Human-readable response message. */
  msg?: string;
}
