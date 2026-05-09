import type { AppInstalledSkillsResponse } from './app-installed-skills-response';

export interface GetMySkillsResult {
  /** Business response code. */
  code: string;
  data?: AppInstalledSkillsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
