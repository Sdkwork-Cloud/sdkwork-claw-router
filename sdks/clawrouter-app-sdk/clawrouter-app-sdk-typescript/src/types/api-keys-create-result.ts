import type { CreateApiKeyResponse } from './create-api-key-response';

/** Api keys create result schema exposed by Claw Router. */
export interface ApiKeysCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on api keys create result. */
  data?: CreateApiKeyResponse;
  /** Human-readable response message. */
  msg?: string;
}
