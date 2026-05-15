import type { AppApiKeyGroup } from './app-api-key-group';
import type { AppApiKeyItem } from './app-api-key-item';

/** App api key list response schema exposed by Claw Router. */
export interface AppApiKeyListResponse {
  /** Groups field on app api key list response. */
  groups: AppApiKeyGroup[];
  /** Items field on app api key list response. */
  items: AppApiKeyItem[];
}
