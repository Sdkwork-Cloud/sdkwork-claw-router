import type { AuthRuntimeSettingsResponse } from './auth-runtime-settings-response';

/** Runtime settings retrieve result schema exposed by Claw Router. */
export interface RuntimeSettingsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on runtime settings retrieve result. */
  data?: AuthRuntimeSettingsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
