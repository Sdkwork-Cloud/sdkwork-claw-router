import type { SkillCatalogItem } from './skill-catalog-item';

export interface AppInstalledSkillItem {
  /** User-scoped runtime configuration for the installed agent skill. */
  config: Record<string, unknown>;
  enabled: boolean;
  id: string;
  installedAt: string;
  lastEnabledAt: string;
  skill: SkillCatalogItem;
  skillId: string;
}
