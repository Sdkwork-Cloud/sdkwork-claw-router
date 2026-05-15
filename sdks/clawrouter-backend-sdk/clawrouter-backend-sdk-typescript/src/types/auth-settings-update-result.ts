import type { AdminAuthSettingsResponse } from './admin-auth-settings-response';

/** Auth settings update result schema exposed by Claw Router. */
export interface AuthSettingsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on auth settings update result. */
  data?: AdminAuthSettingsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
