import type { AppInstalledSkillResponse } from './app-installed-skill-response';

export interface EnableSkillResult {
  /** Business response code. */
  code: string;
  data?: AppInstalledSkillResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
