/** Commerce payment provider account status update request schema exposed by Claw Router. */
export interface CommercePaymentProviderAccountStatusUpdateRequest {
  /** Client request no field on commerce payment provider account status update request. */
  clientRequestNo?: string;
  /** Note field on commerce payment provider account status update request. */
  note?: string | null;
  /** Status field on commerce payment provider account status update request. */
  status: 'active' | 'inactive' | 'disabled';
}
