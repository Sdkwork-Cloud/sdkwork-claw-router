/** Iam oauth authorization url create request schema exposed by Claw Router. */
export interface IamOauthAuthorizationUrlCreateRequest {
  /** Provider code field on iam oauth authorization url create request. */
  providerCode: string;
  /** Redirect uri field on iam oauth authorization url create request. */
  redirectUri: string;
  /** Scope field on iam oauth authorization url create request. */
  scope?: string;
  /** State field on iam oauth authorization url create request. */
  state?: string;
}
