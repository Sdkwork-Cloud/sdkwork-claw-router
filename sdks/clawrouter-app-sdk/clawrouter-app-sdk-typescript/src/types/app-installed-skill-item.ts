import type { JsonValue } from './json-value';
import type { SkillCatalogItem } from './skill-catalog-item';

/** App installed skill item schema exposed by Claw Router. */
export interface AppInstalledSkillItem {
  /** User-scoped runtime configuration for the installed agent skill. */
  config: Record<string, JsonValue>;
  /** Enabled field on app installed skill item. */
  enabled: boolean;
  /** Id field on app installed skill item. */
  id: string;
  /** Installed at field on app installed skill item. */
  installedAt: string;
  /** Last enabled at field on app installed skill item. */
  lastEnabledAt: string;
  /** Skill field on app installed skill item. */
  skill: SkillCatalogItem;
  /** Skill id field on app installed skill item. */
  skillId: string;
}
