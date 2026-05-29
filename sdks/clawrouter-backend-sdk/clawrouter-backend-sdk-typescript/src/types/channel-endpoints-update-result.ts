import type { AdminChannelEndpointMutationResponse } from './admin-channel-endpoint-mutation-response';

/** Channel endpoints update result schema exposed by Claw Router. */
export interface ChannelEndpointsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on channel endpoints update result. */
  data?: AdminChannelEndpointMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
