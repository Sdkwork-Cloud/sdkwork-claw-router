/** Commerce membership member status request schema exposed by Claw Router. */
export interface CommerceMembershipMemberStatusRequest {
  /** Status field on commerce membership member status request. */
  status: 'active' | 'inactive' | 'expired' | 'suspended' | 'cancelled';
}
