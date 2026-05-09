export interface RoutingChannelItem {
  accessType: string;
  apiKey: string;
  balance: string;
  baseUrl: string;
  capabilities: string[];
  errors: number;
  id: string;
  isMultimodal: boolean;
  latency: string;
  models: string[];
  name: string;
  protocol: string;
  provider: string;
  providerCode: string;
  rpm: number;
  status: 'active' | 'disabled' | 'error';
  vendor: string;
  weight: number;
}
