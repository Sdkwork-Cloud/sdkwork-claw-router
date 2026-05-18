import type { AppApiKeyGroup } from './app-api-key-group';

/** App api key group list response schema exposed by Claw Router. */
export interface AppApiKeyGroupListResponse {
  /** Items field on app api key group list response. */
  items: AppApiKeyGroup[];
}
