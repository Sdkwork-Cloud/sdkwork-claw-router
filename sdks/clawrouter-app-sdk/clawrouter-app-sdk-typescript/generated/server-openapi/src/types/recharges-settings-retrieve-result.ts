import type { CommerceRechargeSettingsResponse } from './commerce-recharge-settings-response';

/** Recharges settings retrieve result schema exposed by Claw Router. */
export interface RechargesSettingsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges settings retrieve result. */
  data?: CommerceRechargeSettingsResponse;
  /** Human-readable response message. */
  msg?: string;
}
