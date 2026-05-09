import type { AppCatalogResponse } from './app-catalog-response';

export interface GetAppsResult {
  /** Business response code. */
  code: string;
  data?: AppCatalogResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
