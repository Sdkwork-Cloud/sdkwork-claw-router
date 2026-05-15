import type { AppInstalledSkillResponse } from './app-installed-skill-response';

/** Skills enable result schema exposed by Claw Router. */
export interface SkillsEnableResult {
  /** Business response code. */
  code: string;
  /** Data field on skills enable result. */
  data?: AppInstalledSkillResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
