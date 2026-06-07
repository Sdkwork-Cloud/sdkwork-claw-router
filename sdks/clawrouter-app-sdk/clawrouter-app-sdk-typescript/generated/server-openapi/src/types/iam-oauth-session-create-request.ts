/** Iam oauth session create request schema exposed by Claw Router. */
export interface IamOauthSessionCreateRequest {
  /** Code field on iam oauth session create request. */
  code: string;
  /** Device id field on iam oauth session create request. */
  deviceId?: string;
  /** Device type field on iam oauth session create request. */
  deviceType?: string;
  /** Provider field on iam oauth session create request. */
  provider: string;
  /** State field on iam oauth session create request. */
  state?: string;
}
