import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps update result schema exposed by Claw Router. */
export interface AppsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on apps update result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
