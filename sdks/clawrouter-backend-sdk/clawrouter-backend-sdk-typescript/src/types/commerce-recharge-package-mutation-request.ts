import type { JsonValue } from './json-value';

/** Commerce recharge package mutation request schema exposed by Claw Router. */
export interface CommerceRechargePackageMutationRequest {
  /** Bonus field on commerce recharge package mutation request. */
  bonus: number;
  /** Recharge package price as a canonical decimal money string. */
  rmb: string;
  /** Status field on commerce recharge package mutation request. */
  status?: 'active' | 'inactive';
}
