import type { JsonNull } from './json-null';
import type { ProviderCircuitBreakerPolicy } from './provider-circuit-breaker-policy';
import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Admin channel update request schema exposed by Claw Router. */
export interface AdminChannelUpdateRequest {
  /** Access type field on admin channel update request. */
  accessType?: string;
  /** Plaintext provider API key accepted only on create/update input. Backend encrypts it into integration_provider_account.auth_config and never returns it. */
  apiKey?: string;
  /** Base url field on admin channel update request. */
  baseUrl?: string | null;
  /** Capabilities field on admin channel update request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Circuit breaker policy field on admin channel update request. */
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy | JsonNull;
  /** Id field on admin channel update request. */
  id: string;
  /** Models field on admin channel update request. */
  models?: string[];
  /** Name field on admin channel update request. */
  name?: string;
  /** Protocol field on admin channel update request. */
  protocol?: string;
  /** Retry policy field on admin channel update request. */
  retryPolicy?: ProviderRetryPolicy | JsonNull;
  /** Optional compatibility path for existing Vault/KMS secret references. New admin UI submits apiKey instead. */
  secretRef?: string;
  /** Status field on admin channel update request. */
  status?: 'active' | 'disabled' | 'error';
  /** Timeout ms field on admin channel update request. */
  timeoutMs?: number | null;
  /** Vendor field on admin channel update request. */
  vendor?: string;
  /** Weight field on admin channel update request. */
  weight?: number;
}
