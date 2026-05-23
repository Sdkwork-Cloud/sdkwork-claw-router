import type { AppDetailResponse } from './app-detail-response';

/** Apps store retrieve result schema exposed by Claw Router. */
export interface AppsStoreRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on apps store retrieve result. */
  data?: AppDetailResponse;
  /** Human-readable response message. */
  msg?: string;
}
