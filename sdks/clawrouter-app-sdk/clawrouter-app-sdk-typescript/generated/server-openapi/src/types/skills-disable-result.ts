import type { AppInstalledSkillResponse } from './app-installed-skill-response';

/** Skills disable result schema exposed by Claw Router. */
export interface SkillsDisableResult {
  /** Business response code. */
  code: string;
  /** Data field on skills disable result. */
  data?: AppInstalledSkillResponse;
  /** Human-readable response message. */
  msg?: string;
}
