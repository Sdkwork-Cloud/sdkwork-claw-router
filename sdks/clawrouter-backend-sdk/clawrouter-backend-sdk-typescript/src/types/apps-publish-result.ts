import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps publish result schema exposed by Claw Router. */
export interface AppsPublishResult {
  /** Business response code. */
  code: string;
  /** Data field on apps publish result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
