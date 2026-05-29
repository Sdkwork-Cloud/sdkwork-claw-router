import type { AdminChannelEndpointMutationResponse } from './admin-channel-endpoint-mutation-response';

/** Channel endpoints create result schema exposed by Claw Router. */
export interface ChannelEndpointsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on channel endpoints create result. */
  data?: AdminChannelEndpointMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
