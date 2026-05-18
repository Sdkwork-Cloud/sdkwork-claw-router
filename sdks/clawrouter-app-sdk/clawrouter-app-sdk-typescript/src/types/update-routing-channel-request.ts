import type { JsonNull } from './json-null';
import type { ProviderCircuitBreakerPolicy } from './provider-circuit-breaker-policy';
import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Update routing channel request schema exposed by Claw Router. */
export interface UpdateRoutingChannelRequest {
  /** Access type field on update routing channel request. */
  accessType?: string;
  /** Base url field on update routing channel request. */
  baseUrl?: string | null;
  /** Capabilities field on update routing channel request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Circuit breaker policy field on update routing channel request. */
  circuitBreakerPolicy?: ProviderCircuitBreakerPolicy | JsonNull;
  /** Models field on update routing channel request. */
  models?: string[];
  /** Name field on update routing channel request. */
  name?: string;
  /** Protocol field on update routing channel request. */
  protocol?: string;
  /** Retry policy field on update routing channel request. */
  retryPolicy?: ProviderRetryPolicy | JsonNull;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef?: string;
  /** Status field on update routing channel request. */
  status?: 'active' | 'disabled' | 'error';
  /** Timeout ms field on update routing channel request. */
  timeoutMs?: number | null;
  /** Vendor field on update routing channel request. */
  vendor?: string;
  /** Weight field on update routing channel request. */
  weight?: number;
}
