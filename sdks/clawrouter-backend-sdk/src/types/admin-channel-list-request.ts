export interface AdminChannelListRequest {
  status?: 'active' | 'disabled' | 'error';
  vendor?: string;
}
