import type { AppApiKeyItem } from './app-api-key-item';

/** Create api key response schema exposed by Claw Router. */
export interface CreateApiKeyResponse {
  /** Item field on create api key response. */
  item: AppApiKeyItem;
  /** One-time raw API key secret. It is never returned by list/read APIs. */
  rawKey: string;
}
