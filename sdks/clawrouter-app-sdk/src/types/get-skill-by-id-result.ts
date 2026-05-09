import type { SkillDetailResponse } from './skill-detail-response';

export interface GetSkillByIdResult {
  /** Business response code. */
  code: string;
  data?: SkillDetailResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
