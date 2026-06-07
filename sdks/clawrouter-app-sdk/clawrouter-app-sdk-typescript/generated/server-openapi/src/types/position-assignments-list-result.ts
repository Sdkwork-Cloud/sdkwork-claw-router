import type { IamPositionAssignmentListResponse } from './iam-position-assignment-list-response';

/** Position assignments list result schema exposed by Claw Router. */
export interface PositionAssignmentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on position assignments list result. */
  data?: IamPositionAssignmentListResponse;
  /** Human-readable response message. */
  msg?: string;
}
