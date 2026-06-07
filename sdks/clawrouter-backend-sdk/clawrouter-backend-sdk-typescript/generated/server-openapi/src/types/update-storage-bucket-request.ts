/** Update storage bucket request schema exposed by Claw Router. */
export interface UpdateStorageBucketRequest {
  /** Reason field on update storage bucket request. */
  reason: string;
  /** Status field on update storage bucket request. */
  status: 'active' | 'archived' | 'disabled';
}
