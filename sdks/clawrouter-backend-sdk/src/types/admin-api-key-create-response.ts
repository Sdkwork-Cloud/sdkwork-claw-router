import type { AdminApiKeyItem } from './admin-api-key-item';

export interface AdminApiKeyCreateResponse {
  key: AdminApiKeyItem;
  /** One-time plaintext API key material returned immediately after creation. */
  rawKey: string;
}
