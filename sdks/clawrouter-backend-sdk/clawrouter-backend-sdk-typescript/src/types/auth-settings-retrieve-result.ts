import type { AdminAuthSettingsResponse } from './admin-auth-settings-response';

/** Auth settings retrieve result schema exposed by Claw Router. */
export interface AuthSettingsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on auth settings retrieve result. */
  data?: AdminAuthSettingsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
