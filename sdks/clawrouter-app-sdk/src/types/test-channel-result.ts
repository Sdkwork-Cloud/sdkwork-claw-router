import type { RoutingChannelTestResponse } from './routing-channel-test-response';

export interface TestChannelResult {
  /** Business response code. */
  code: string;
  data?: RoutingChannelTestResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
