import type { CommerceCategorySeedInitializeSummary } from './commerce-category-seed-initialize-summary';

/** Commerce category seed initialize response schema exposed by Claw Router. */
export interface CommerceCategorySeedInitializeResponse {
  /** Items field on commerce category seed initialize response. */
  items: CommerceCategorySeedInitializeSummary[];
}
