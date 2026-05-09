import type { UpdateSettingsResponse } from './update-settings-response';

export interface UpdateSettingsResult {
  /** Business response code. */
  code: string;
  data?: UpdateSettingsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
