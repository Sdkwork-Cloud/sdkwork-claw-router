import type { AppModelCatalogResponse } from './app-model-catalog-response';

export interface FetchModelsResult {
  /** Business response code. */
  code: string;
  data?: AppModelCatalogResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
