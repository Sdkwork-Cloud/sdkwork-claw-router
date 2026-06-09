import type { IamPositionAssignmentItem } from './iam-position-assignment-item';

/** Iam position assignment list response schema exposed by Claw Router. */
export interface IamPositionAssignmentListResponse {
  /** Items field on iam position assignment list response. */
  items: IamPositionAssignmentItem[];
}
