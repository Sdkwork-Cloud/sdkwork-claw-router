import type { ProviderRetryPolicy } from './provider-retry-policy';

export interface AdminChannelUpdateRequest {
  accessType?: string;
  baseUrl?: string | null;
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  id: string;
  models?: string[];
  name?: string;
  protocol?: string;
  retryPolicy?: ProviderRetryPolicy | null;
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
  secretRef?: string;
  status?: 'active' | 'disabled' | 'error';
  timeoutMs?: number | null;
  vendor?: string;
  weight?: number;
}
