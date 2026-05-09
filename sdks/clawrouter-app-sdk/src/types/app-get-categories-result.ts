import type { AppCategoriesResponse } from './app-categories-response';

export interface AppGetCategoriesResult {
  /** Business response code. */
  code: string;
  data?: AppCategoriesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
