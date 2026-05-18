import type { DeleteApiKeyResponse } from './delete-api-key-response';

/** Api keys delete result schema exposed by Claw Router. */
export interface ApiKeysDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on api keys delete result. */
  data?: DeleteApiKeyResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
