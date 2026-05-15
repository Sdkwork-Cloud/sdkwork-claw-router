import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Persisted channel snapshot returned after the provider health probe. Secret refs and tokens are not returned. */
export interface AdminChannelItem {
  /** Access type field on admin channel item. */
  accessType: string;
  /** Balance field on admin channel item. */
  balance: string;
  /** Base url field on admin channel item. */
  baseUrl?: string;
  /** Capabilities field on admin channel item. */
  capabilities: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
  /** Errors field on admin channel item. */
  errors: number;
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
