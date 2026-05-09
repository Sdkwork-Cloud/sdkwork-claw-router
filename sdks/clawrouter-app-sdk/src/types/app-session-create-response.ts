export interface AppSessionCreateResponse {
  /** Unix timestamp in seconds when the app session expires. */
  expiresAt: number;
  /** Session TTL in seconds. */
  expiresInSeconds: number;
  /** Signed app session bearer token. */
  token: string;
  /** Token type used by the generated app SDK auth boundary. */
  tokenType: 'Bearer';
}
