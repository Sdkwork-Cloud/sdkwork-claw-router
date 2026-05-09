import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Persisted channel snapshot returned after the provider health probe. Secret refs and tokens are not returned. */
export interface AdminChannelItem {
  accessType: string;
  balance: string;
  baseUrl?: string;
  capabilities: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  errors: number;
  id: string;
  isMultimodal: boolean;
  models: string[];
  name: string;
  protocol: string;
  retryPolicy?: ProviderRetryPolicy;
  secretRef?: string;
  status: 'active' | 'disabled' | 'error';
  timeoutMs?: number;
  vendor: string;
  weight: number;
}
