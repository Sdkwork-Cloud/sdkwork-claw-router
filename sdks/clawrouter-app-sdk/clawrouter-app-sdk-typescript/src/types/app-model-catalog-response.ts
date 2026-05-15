import type { AppModelCatalogItem } from './app-model-catalog-item';

/** App model catalog response schema exposed by Claw Router. */
export interface AppModelCatalogResponse {
  /** Items field on app model catalog response. */
  items: AppModelCatalogItem[];
}
