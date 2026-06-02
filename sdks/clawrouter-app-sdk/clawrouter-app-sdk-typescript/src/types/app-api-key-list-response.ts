import type { AppApiKeyItem } from './app-api-key-item';
import type { AppChannelGroup } from './app-channel-group';

/** App api key list response schema exposed by Claw Router. */
export interface AppApiKeyListResponse {
  /** Groups field on app api key list response. */
  groups: AppChannelGroup[];
  /** Items field on app api key list response. */
  items: AppApiKeyItem[];
}
