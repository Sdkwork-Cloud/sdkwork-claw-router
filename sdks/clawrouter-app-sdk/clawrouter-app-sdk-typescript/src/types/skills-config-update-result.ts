import type { AppInstalledSkillResponse } from './app-installed-skill-response';

/** Skills config update result schema exposed by Claw Router. */
export interface SkillsConfigUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on skills config update result. */
  data?: AppInstalledSkillResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
