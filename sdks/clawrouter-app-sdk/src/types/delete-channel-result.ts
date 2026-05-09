import type { RoutingChannelDeleteResponse } from './routing-channel-delete-response';

export interface DeleteChannelResult {
  /** Business response code. */
  code: string;
  data?: RoutingChannelDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
