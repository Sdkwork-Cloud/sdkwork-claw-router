import type { SkillCatalogItem } from './skill-catalog-item';

/** Skills catalog response schema exposed by Claw Router. */
export interface SkillsCatalogResponse {
  /** Items field on skills catalog response. */
  items: SkillCatalogItem[];
}
