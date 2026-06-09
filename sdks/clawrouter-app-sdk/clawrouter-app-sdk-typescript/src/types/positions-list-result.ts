import type { IamPositionListResponse } from './iam-position-list-response';

/** Positions list result schema exposed by Claw Router. */
export interface PositionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on positions list result. */
  data?: IamPositionListResponse;
  /** Human-readable response message. */
  msg?: string;
}
