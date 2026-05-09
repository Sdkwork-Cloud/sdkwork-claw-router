export interface AppPasswordLoginResponse {
  /** Unix timestamp in seconds when the app session expires. */
  expiresAt: number;
  /** Session TTL in seconds. */
  expiresInSeconds: number;
  /** Signed app session bearer token. */
  token: string;
  /** Token type used by generated app SDK auth clients. */
  tokenType: 'Bearer';
  user: Record<string, unknown>;
}
