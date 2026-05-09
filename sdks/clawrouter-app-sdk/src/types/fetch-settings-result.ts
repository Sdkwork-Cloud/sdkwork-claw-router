import type { SettingsDataResponse } from './settings-data-response';

export interface FetchSettingsResult {
  /** Business response code. */
  code: string;
  data?: SettingsDataResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
