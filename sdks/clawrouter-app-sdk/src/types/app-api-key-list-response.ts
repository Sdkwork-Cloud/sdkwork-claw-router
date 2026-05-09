import type { AppApiKeyGroup } from './app-api-key-group';
import type { AppApiKeyItem } from './app-api-key-item';

export interface AppApiKeyListResponse {
  groups: AppApiKeyGroup[];
  items: AppApiKeyItem[];
}
