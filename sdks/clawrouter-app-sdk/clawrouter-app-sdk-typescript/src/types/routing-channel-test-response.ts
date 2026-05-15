import type { RoutingChannelItem } from './routing-channel-item';

/** Routing channel test response schema exposed by Claw Router. */
export interface RoutingChannelTestResponse {
  /** Channel id field on routing channel test response. */
  channelId: string;
  /** Item field on routing channel test response. */
  item: RoutingChannelItem;
  /** Latency field on routing channel test response. */
  latency: string;
  /** Status field on routing channel test response. */
  status: 'active' | 'disabled' | 'error';
  /** Success field on routing channel test response. */
  success: boolean;
}
