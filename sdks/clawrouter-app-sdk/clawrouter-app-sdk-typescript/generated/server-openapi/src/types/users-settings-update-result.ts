import type { UpdateSettingsResponse } from './update-settings-response';

/** Users settings update result schema exposed by Claw Router. */
export interface UsersSettingsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on users settings update result. */
  data?: UpdateSettingsResponse;
  /** Human-readable response message. */
  msg?: string;
}
