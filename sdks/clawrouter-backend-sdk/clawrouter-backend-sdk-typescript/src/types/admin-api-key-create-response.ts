import type { AdminApiKeyItem } from './admin-api-key-item';

/** Admin api key create response schema exposed by Claw Router. */
export interface AdminApiKeyCreateResponse {
  /** Key field on admin api key create response. */
  key: AdminApiKeyItem;
  /** One-time plaintext API key material returned immediately after creation. */
  rawKey: string;
}
