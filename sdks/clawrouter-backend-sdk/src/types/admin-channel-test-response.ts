import type { AdminChannelItem } from './admin-channel-item';

export interface AdminChannelTestResponse {
  channelId: string;
  item: AdminChannelItem;
  latency: string;
  status: 'active' | 'disabled' | 'error';
  success: boolean;
}
