import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps unpublish result schema exposed by Claw Router. */
export interface AppsUnpublishResult {
  /** Business response code. */
  code: string;
  /** Data field on apps unpublish result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
