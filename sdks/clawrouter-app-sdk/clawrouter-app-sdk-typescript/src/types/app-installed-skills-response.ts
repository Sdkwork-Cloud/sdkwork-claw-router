import type { AppInstalledSkillItem } from './app-installed-skill-item';

/** App installed skills response schema exposed by Claw Router. */
export interface AppInstalledSkillsResponse {
  /** Items field on app installed skills response. */
  items: AppInstalledSkillItem[];
}
