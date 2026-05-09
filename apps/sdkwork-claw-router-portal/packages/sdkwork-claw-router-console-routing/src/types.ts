export type ChannelStatus = 'active' | 'disabled' | 'error';

export interface Channel {
  id: string;
  name: string;
  vendor: string;
  provider: string;
  providerCode: string;
  protocol: string;
  accessType: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  capabilities: string[];
  isMultimodal: boolean;
  weight: number;
  status: ChannelStatus;
  latency: string;
  rpm: number;
  balance: string;
  errors: number;
}
