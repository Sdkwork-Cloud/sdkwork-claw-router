import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Routing channel item schema exposed by Claw Router. */
export interface RoutingChannelItem {
  /** Access type field on routing channel item. */
  accessType: string;
  /** Api key field on routing channel item. */
  apiKey: string;
  /** Balance field on routing channel item. */
  balance: string;
  /** Base url field on routing channel item. */
  baseUrl: string;
  /** Capabilities field on routing channel item. */
  capabilities: string[];
  /** Errors field on routing channel item. */
  errors: number;
  /** Id field on routing channel item. */
  id: string;
  /** Is multimodal field on routing channel item. */
  isMultimodal: boolean;
  /** Latency field on routing channel item. */
  latency: string;
  /** Models field on routing channel item. */
  models: string[];
  /** Name field on routing channel item. */
  name: string;
  /** Protocol field on routing channel item. */
  protocol: string;
  /** Provider field on routing channel item. */
  provider: string;
  /** Provider code field on routing channel item. */
  providerCode: string;
  /** Retry policy field on routing channel item. */
  retryPolicy?: ProviderRetryPolicy;
  /** Rpm field on routing channel item. */
  rpm: number;
  /** Status field on routing channel item. */
  status: 'active' | 'disabled' | 'error';
  /** Timeout ms field on routing channel item. */
  timeoutMs?: number;
  /** Vendor field on routing channel item. */
  vendor: string;
  /** Weight field on routing channel item. */
  weight: number;
}
