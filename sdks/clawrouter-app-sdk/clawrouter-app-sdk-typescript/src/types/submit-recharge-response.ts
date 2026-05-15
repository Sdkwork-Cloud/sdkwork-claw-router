/** Submit recharge response schema exposed by Claw Router. */
export interface SubmitRechargeResponse {
  /** Amount field on submit recharge response. */
  amount: string;
  /** Order no field on submit recharge response. */
  orderNo: string;
  /** Payment method field on submit recharge response. */
  paymentMethod: string;
  /** Points field on submit recharge response. */
  points: number;
  /** Status field on submit recharge response. */
  status: string;
  /** Success field on submit recharge response. */
  success: boolean;
}
