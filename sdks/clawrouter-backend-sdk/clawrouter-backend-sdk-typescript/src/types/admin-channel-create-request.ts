import type { ProviderCircuitBreakerPolicy } from './provider-circuit-breaker-policy';
import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Admin channel create request schema exposed by Claw Router. */
export interface AdminChannelCreateRequest {
  /** Access type field on admin channel create request. */
  accessType?: string;
  /** Plaintext provider API key accepted only on create/update input. Backend encrypts it into integration_provider_account.auth_config and never returns it. */
  apiKey: string;
  /** Base url field on admin channel create request. */
  baseUrl?: string;
  /** Capabilities field on admin channel create request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Circuit breaker policy field on admin channel create request. */
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy;
  /** Expires at field on admin channel create request. */
  expiresAt?: string | null;
  /** Models field on admin channel create request. */
  models: string[];
  /** Name field on admin channel create request. */
  name: string;
  /** Protocol field on admin channel create request. */
  protocol?: string;
  /** Retry policy field on admin channel create request. */
  retryPolicy?: ProviderRetryPolicy;
  /** Optional compatibility path for existing Vault/KMS secret references. New admin UI submits apiKey instead. */
  secretRef?: string;
  /** Status field on admin channel create request. */
  status?: 'active' | 'disabled' | 'error';
  /** Per-channel upstream response timeout in milliseconds. */
  timeoutMs?: number;
  /** Vendor field on admin channel create request. */
  vendor: string;
  /** Weight field on admin channel create request. */
  weight?: number;
}
