/** Commerce wallet command request schema exposed by Claw Router. */
export interface CommerceWalletCommandRequest {
  /** Amount field on commerce wallet command request. */
  amount: string;
  /** Asset type field on commerce wallet command request. */
  assetType?: string;
  /** Remarks field on commerce wallet command request. */
  remarks?: string;
  /** Request no field on commerce wallet command request. */
  requestNo: string;
}
