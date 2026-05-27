import type { AuthRuntimeSettingsResponse } from './auth-runtime-settings-response';

/** Iam runtime retrieve result schema exposed by Claw Router. */
export interface IamRuntimeRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on iam runtime retrieve result. */
  data?: AuthRuntimeSettingsResponse;
  /** Human-readable response message. */
  msg?: string;
}
