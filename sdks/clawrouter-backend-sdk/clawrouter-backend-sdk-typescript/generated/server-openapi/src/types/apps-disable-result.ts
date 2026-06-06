import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps disable result schema exposed by Claw Router. */
export interface AppsDisableResult {
  /** Business response code. */
  code: string;
  /** Data field on apps disable result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
