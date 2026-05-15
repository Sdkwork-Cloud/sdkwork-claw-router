import type { JsonNull } from './json-null';
import type { ProviderRetryPolicy } from './provider-retry-policy';

/** Admin channel update request schema exposed by Claw Router. */
export interface AdminChannelUpdateRequest {
  /** Access type field on admin channel update request. */
  accessType?: string;
  /** Base url field on admin channel update request. */
  baseUrl?: string | null;
  /** Capabilities field on admin channel update request. */
  capabilities?: ('llm' | 'image' | 'audio' | 'music' | 'sfx' | 'video')[];
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
  /** Vault/KMS secret reference. Plaintext credential fields are forbidden. */
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
