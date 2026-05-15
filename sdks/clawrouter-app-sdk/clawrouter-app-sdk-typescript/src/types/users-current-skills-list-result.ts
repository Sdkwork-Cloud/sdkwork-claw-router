import type { AppInstalledSkillsResponse } from './app-installed-skills-response';

/** Users current skills list result schema exposed by Claw Router. */
export interface UsersCurrentSkillsListResult {
  /** Business response code. */
  code: string;
  /** Data field on users current skills list result. */
  data?: AppInstalledSkillsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
