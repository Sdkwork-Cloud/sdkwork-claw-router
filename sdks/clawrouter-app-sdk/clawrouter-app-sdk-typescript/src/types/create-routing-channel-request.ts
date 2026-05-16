import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Create routing channel request schema exposed by Claw Router. */
export interface CreateRoutingChannelRequest {
  /** Access type field on create routing channel request. */
  accessType?: string;
  /** Base url field on create routing channel request. */
  baseUrl?: string;
  /** Capabilities field on create routing channel request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Models field on create routing channel request. */
  models: string[];
  /** Name field on create routing channel request. */
  name: string;
  /** Protocol field on create routing channel request. */
  protocol?: string;
  /** Retry policy field on create routing channel request. */
  retryPolicy?: ProviderRetryPolicy;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef: string;
  /** Status field on create routing channel request. */
  status?: 'active' | 'disabled' | 'error';
  /** Per-channel upstream response timeout in milliseconds. */
  timeoutMs?: number;
  /** Vendor field on create routing channel request. */
  vendor: string;
  /** Weight field on create routing channel request. */
  weight?: number;
}
