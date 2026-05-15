import type { IamAppContext } from './iam-app-context';
import type { IamUserResponse } from './iam-user-response';

/** Iam session response schema exposed by Claw Router. */
export interface IamSessionResponse {
  /** Data isolation and tenant access token. Clients send it as Sdkwork-Access-Token. */
  accessToken: string;
  /** Bearer authentication token. Clients send it as Authorization Bearer. */
  authToken: string;
  /** Context field on iam session response. */
  context: IamAppContext;
  /** Expires at field on iam session response. */
  expiresAt?: string;
  /** Refresh token for session renewal. */
  refreshToken?: string;
  /** Session id field on iam session response. */
  sessionId?: string;
  /** User field on iam session response. */
  user: IamUserResponse;
}
