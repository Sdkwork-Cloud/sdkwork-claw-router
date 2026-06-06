import type { AppCatalogItem } from './app-catalog-item';

/** App catalog response schema exposed by Claw Router. */
export interface AppCatalogResponse {
  /** Has next page field on app catalog response. */
  hasNextPage: boolean;
  /** Items field on app catalog response. */
  items: AppCatalogItem[];
  /** Page field on app catalog response. */
  page: number;
  /** Page size field on app catalog response. */
  pageSize: number;
  /** Total field on app catalog response. */
  total: string;
}
