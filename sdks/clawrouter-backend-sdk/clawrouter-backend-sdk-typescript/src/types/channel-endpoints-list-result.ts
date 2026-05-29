import type { AdminChannelEndpointsResponse } from './admin-channel-endpoints-response';

/** Channel endpoints list result schema exposed by Claw Router. */
export interface ChannelEndpointsListResult {
  /** Business response code. */
  code: string;
  /** Data field on channel endpoints list result. */
  data?: AdminChannelEndpointsResponse;
  /** Human-readable response message. */
  msg?: string;
}
