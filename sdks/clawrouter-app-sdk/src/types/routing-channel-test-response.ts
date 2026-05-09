import type { RoutingChannelItem } from './routing-channel-item';

export interface RoutingChannelTestResponse {
  channelId: string;
  item: RoutingChannelItem;
  latency: string;
  status: 'active' | 'disabled' | 'error';
  success: boolean;
}
