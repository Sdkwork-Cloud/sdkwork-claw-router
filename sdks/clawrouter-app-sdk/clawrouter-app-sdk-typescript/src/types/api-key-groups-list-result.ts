import type { AppApiKeyGroupListResponse } from './app-api-key-group-list-response';

/** Api key groups list result schema exposed by Claw Router. */
export interface ApiKeyGroupsListResult {
  /** Business response code. */
  code: string;
  /** Data field on api key groups list result. */
  data?: AppApiKeyGroupListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
