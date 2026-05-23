import type { SettingsDataResponse } from './settings-data-response';

/** Users settings retrieve result schema exposed by Claw Router. */
export interface UsersSettingsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on users settings retrieve result. */
  data?: SettingsDataResponse;
  /** Human-readable response message. */
  msg?: string;
}
