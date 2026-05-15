import type { AppCatalogResponse } from './app-catalog-response';

/** Apps store list result schema exposed by Claw Router. */
export interface AppsStoreListResult {
  /** Business response code. */
  code: string;
  /** Data field on apps store list result. */
  data?: AppCatalogResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
