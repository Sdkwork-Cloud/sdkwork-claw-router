import type { AdminRechargeSettingsResponse } from './admin-recharge-settings-response';

/** Recharges settings update result schema exposed by Claw Router. */
export interface RechargesSettingsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges settings update result. */
  data?: AdminRechargeSettingsResponse;
  /** Human-readable response message. */
  msg?: string;
}
