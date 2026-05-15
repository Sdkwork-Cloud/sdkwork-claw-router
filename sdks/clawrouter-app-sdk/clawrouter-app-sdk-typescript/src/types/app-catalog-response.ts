import type { AppCatalogItem } from './app-catalog-item';

/** App catalog response schema exposed by Claw Router. */
export interface AppCatalogResponse {
  /** Items field on app catalog response. */
  items: AppCatalogItem[];
}
