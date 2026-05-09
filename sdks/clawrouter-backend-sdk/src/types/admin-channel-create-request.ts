import type { ProviderRetryPolicy } from './provider-retry-policy';

export interface AdminChannelCreateRequest {
  accessType?: string;
  baseUrl?: string;
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  models: string[];
  name: string;
  protocol?: string;
  retryPolicy?: ProviderRetryPolicy;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef: string;
  status?: 'active' | 'disabled' | 'error';
  /** Per-channel upstream response timeout in milliseconds. */
  timeoutMs?: number;
  vendor: string;
  weight?: number;
}
