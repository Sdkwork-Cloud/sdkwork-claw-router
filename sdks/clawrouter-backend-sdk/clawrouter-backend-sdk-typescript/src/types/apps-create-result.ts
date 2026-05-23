import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps create result schema exposed by Claw Router. */
export interface AppsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on apps create result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
