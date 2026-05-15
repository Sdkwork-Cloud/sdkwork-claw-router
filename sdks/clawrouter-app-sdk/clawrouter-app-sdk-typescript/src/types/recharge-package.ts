/** Recharge package schema exposed by Claw Router. */
export interface RechargePackage {
  /** Bonus field on recharge package. */
  bonus: number;
  /** Id field on recharge package. */
  id: string;
  /** Total credited points for this recharge package, including bonus points. */
  points: number;
  /** Recharge package price as a canonical decimal money string. */
  rmb: string;
}
