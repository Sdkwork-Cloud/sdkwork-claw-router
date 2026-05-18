export type ChannelStatus = 'active' | 'disabled' | 'error';
export type RetryableStatusCode = 408 | 409 | 425 | 429 | 500 | 502 | 503 | 504;

export interface RoutingRetryPolicy {
  maxAttempts: number;
  retryableStatusCodes: RetryableStatusCode[];
  backoffMs?: number;
}

export interface RoutingCircuitBreakerPolicy {
  failureThreshold: number;
}

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
  timeoutMs?: number;
  retryPolicy?: RoutingRetryPolicy;
  circuitBreakerPolicy?: RoutingCircuitBreakerPolicy;
  weight: number;
  status: ChannelStatus;
  latency: string;
  rpm: number;
  balance: string;
  errors: number;
}
