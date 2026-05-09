import type { AppApiKeyItem } from './app-api-key-item';

export interface CreateApiKeyResponse {
  item: AppApiKeyItem;
  /** One-time raw API key secret. It is never returned by list/read APIs. */
  rawKey: string;
}
