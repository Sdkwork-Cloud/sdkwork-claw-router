import type { AppApiKeyListResponse } from './app-api-key-list-response';

/** Api keys list result schema exposed by Claw Router. */
export interface ApiKeysListResult {
  /** Business response code. */
  code: string;
  /** Data field on api keys list result. */
  data?: AppApiKeyListResponse;
  /** Human-readable response message. */
  msg?: string;
}
