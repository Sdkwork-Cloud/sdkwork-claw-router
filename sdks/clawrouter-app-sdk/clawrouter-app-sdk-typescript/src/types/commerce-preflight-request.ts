/** Commerce preflight request schema exposed by Claw Router. */
export interface CommercePreflightRequest {
  /** Amount field on commerce preflight request. */
  amount: string;
  /** Business type field on commerce preflight request. */
  businessType?: string;
  /** Remarks field on commerce preflight request. */
  remarks?: string;
  /** Request no field on commerce preflight request. */
  requestNo: string;
}
