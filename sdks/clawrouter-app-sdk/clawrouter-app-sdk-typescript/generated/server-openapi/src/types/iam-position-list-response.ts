import type { IamPositionItem } from './iam-position-item';

/** Iam position list response schema exposed by Claw Router. */
export interface IamPositionListResponse {
  /** Items field on iam position list response. */
  items: IamPositionItem[];
}
