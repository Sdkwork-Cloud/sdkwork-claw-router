import type { UpdateApiKeyResponse } from './update-api-key-response';

/** Api keys update result schema exposed by Claw Router. */
export interface ApiKeysUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on api keys update result. */
  data?: UpdateApiKeyResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
