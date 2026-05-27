/** Update storage provider request schema exposed by Claw Router. */
export interface UpdateStorageProviderRequest {
  /** Reason field on update storage provider request. */
  reason: string;
  /** Status field on update storage provider request. */
  status: 'active' | 'archived' | 'disabled';
}
