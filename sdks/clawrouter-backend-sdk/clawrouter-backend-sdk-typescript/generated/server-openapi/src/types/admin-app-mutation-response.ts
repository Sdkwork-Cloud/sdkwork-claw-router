import type { AdminAppItemResponse } from './admin-app-item-response';

/** Admin app mutation response schema exposed by Claw Router. */
export interface AdminAppMutationResponse {
  /** Item field on admin app mutation response. */
  item: AdminAppItemResponse;
}
