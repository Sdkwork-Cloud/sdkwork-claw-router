/** Commerce recharge order create request schema exposed by Claw Router. */
export interface CommerceRechargeOrderCreateRequest {
  /** Amount field on commerce recharge order create request. */
  amount: string;
  /** Client request no field on commerce recharge order create request. */
  clientRequestNo?: string;
  /** Currency code field on commerce recharge order create request. */
  currencyCode: string;
  /** Package id field on commerce recharge order create request. */
  packageId?: string;
  /** Source field on commerce recharge order create request. */
  source: string;
}
