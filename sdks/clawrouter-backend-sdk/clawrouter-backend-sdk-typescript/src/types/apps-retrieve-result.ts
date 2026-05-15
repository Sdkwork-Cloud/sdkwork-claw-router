import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps retrieve result schema exposed by Claw Router. */
export interface AppsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on apps retrieve result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
