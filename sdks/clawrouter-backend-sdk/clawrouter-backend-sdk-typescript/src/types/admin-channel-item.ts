import type { ProviderCircuitBreakerPolicy } from './provider-circuit-breaker-policy';
import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Persisted channel snapshot returned after the provider health probe. Admin management responses may return the stored plaintext provider API key for channel credential relay operations. */
export interface AdminChannelItem {
  /** Access type field on admin channel item. */
  accessType: string;
  /** Full plaintext provider API key returned by authenticated admin management responses for channel credential relay operations. */
  apiKey?: string;
  /** Balance field on admin channel item. */
  balance: string;
  /** Base url field on admin channel item. */
  baseUrl?: string;
  /** Capabilities field on admin channel item. */
  capabilities: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Scoped ai_channel id used by channel endpoint configuration. */
  channelId: string;
  /** Channel type field on admin channel item. */
  channelType: 'official' | 'relay';
  /** Circuit breaker policy field on admin channel item. */
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy;
  /** Created at field on admin channel item. */
  createdAt: string;
  /** Errors field on admin channel item. */
  errors: number;
  /** Expires at field on admin channel item. */
  expiresAt?: string | null;
  /** Id field on admin channel item. */
  id: string;
  /** Is multimodal field on admin channel item. */
  isMultimodal: boolean;
  /** Models field on admin channel item. */
  models: string[];
  /** Name field on admin channel item. */
  name: string;
  /** Protocol field on admin channel item. */
  protocol: string;
  /** Resource codes field on admin channel item. */
  resourceCodes: string[];
  /** Retry policy field on admin channel item. */
  retryPolicy?: ProviderRetryPolicy;
  /** Secret ref field on admin channel item. */
  secretRef?: string;
  /** Status field on admin channel item. */
  status: 'active' | 'disabled' | 'error';
  /** Timeout ms field on admin channel item. */
  timeoutMs?: number;
  /** Vendor field on admin channel item. */
  vendor: string;
  /** Weight field on admin channel item. */
  weight: number;
}
