import type { AdminApiKeysMapResponse } from './admin-api-keys-map-response';

/** Api keys list result schema exposed by Claw Router. */
export interface ApiKeysListResult {
  /** Business response code. */
  code: string;
  /** Data field on api keys list result. */
  data?: AdminApiKeysMapResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
