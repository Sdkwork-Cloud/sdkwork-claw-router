import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Routing channels response schema exposed by Claw Router. */
export interface RoutingChannelsResponse {
  /** Items field on routing channels response. */
  items: Record<string, unknown>[];
}
