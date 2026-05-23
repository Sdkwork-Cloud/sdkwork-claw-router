import type { AdminAppMutationResponse } from './admin-app-mutation-response';

/** Apps enable result schema exposed by Claw Router. */
export interface AppsEnableResult {
  /** Business response code. */
  code: string;
  /** Data field on apps enable result. */
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
