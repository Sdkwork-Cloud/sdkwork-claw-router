import type { AdminChannelEndpointItem } from './admin-channel-endpoint-item';

/** Admin channel endpoints response schema exposed by Claw Router. */
export interface AdminChannelEndpointsResponse {
  /** Items field on admin channel endpoints response. */
  items: AdminChannelEndpointItem[];
}
