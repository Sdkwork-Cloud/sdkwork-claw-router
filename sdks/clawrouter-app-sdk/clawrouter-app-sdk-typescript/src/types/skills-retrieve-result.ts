import type { SkillDetailResponse } from './skill-detail-response';

/** Skills retrieve result schema exposed by Claw Router. */
export interface SkillsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on skills retrieve result. */
  data?: SkillDetailResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
