import type { AdminModelCatalogSyncResponse } from './admin-model-catalog-sync-response';

export interface SyncVendorsAndModelsResult {
  /** Business response code. */
  code: string;
  data?: AdminModelCatalogSyncResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
