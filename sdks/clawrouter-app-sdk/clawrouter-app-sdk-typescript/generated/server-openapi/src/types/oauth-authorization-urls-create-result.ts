import type { IamOauthAuthorizationUrlResponse } from './iam-oauth-authorization-url-response';

/** Oauth authorization urls create result schema exposed by Claw Router. */
export interface OauthAuthorizationUrlsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oauth authorization urls create result. */
  data?: IamOauthAuthorizationUrlResponse;
  /** Human-readable response message. */
  msg?: string;
}
