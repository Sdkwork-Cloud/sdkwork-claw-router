import type { AdminApiKeyItem } from './admin-api-key-item';

/** Admin api keys map response schema exposed by Claw Router. */
export interface AdminApiKeysMapResponse {
  [key: string]: AdminApiKeyItem[];
}