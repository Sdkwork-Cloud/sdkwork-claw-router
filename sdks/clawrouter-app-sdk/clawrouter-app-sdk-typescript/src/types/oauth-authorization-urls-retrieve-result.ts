import type { IamOauthAuthorizationUrlResponse } from './iam-oauth-authorization-url-response';

/** Oauth authorization urls retrieve result schema exposed by Claw Router. */
export interface OauthAuthorizationUrlsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on oauth authorization urls retrieve result. */
  data?: IamOauthAuthorizationUrlResponse;
  /** Human-readable response message. */
  msg?: string;
}
