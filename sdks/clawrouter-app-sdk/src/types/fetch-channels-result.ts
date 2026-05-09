import type { RoutingChannelsResponse } from './routing-channels-response';

export interface FetchChannelsResult {
  /** Business response code. */
  code: string;
  data?: RoutingChannelsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
