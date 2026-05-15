import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Admin channel create request schema exposed by Claw Router. */
export interface AdminChannelCreateRequest {
  /** Access type field on admin channel create request. */
  accessType?: string;
  /** Base url field on admin channel create request. */
  baseUrl?: string;
  /** Capabilities field on admin channel create request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Models field on admin channel create request. */
  models: string[];
  /** Name field on admin channel create request. */
  name: string;
  /** Protocol field on admin channel create request. */
  protocol?: string;
  /** Retry policy field on admin channel create request. */
  retryPolicy?: ProviderRetryPolicy;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef: string;
  /** Status field on admin channel create request. */
  status?: 'active' | 'disabled' | 'error';
  /** Per-channel upstream response timeout in milliseconds. */
  timeoutMs?: number;
  /** Vendor field on admin channel create request. */
  vendor: string;
  /** Weight field on admin channel create request. */
  weight?: number;
}
