import type { AppCategoriesResponse } from './app-categories-response';

/** Apps store categories list result schema exposed by Claw Router. */
export interface AppsStoreCategoriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on apps store categories list result. */
  data?: AppCategoriesResponse;
  /** Human-readable response message. */
  msg?: string;
}
