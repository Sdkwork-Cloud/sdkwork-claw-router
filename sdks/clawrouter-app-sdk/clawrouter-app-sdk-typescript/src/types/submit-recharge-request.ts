/** Submit recharge request schema exposed by Claw Router. */
export interface SubmitRechargeRequest {
  /** Recharge amount as a canonical decimal money string. */
  amount: string;
  /** Payment method code. */
  method: string;
}
