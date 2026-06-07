/** Open platform qr auth scan response schema exposed by Claw Router. */
export interface OpenPlatformQrAuthScanResponse {
  /** Account id field on open platform qr auth scan response. */
  accountId?: string | null;
  /** Created at field on open platform qr auth scan response. */
  createdAt: string;
  /** Entry id field on open platform qr auth scan response. */
  entryId?: string | null;
  /** External user id field on open platform qr auth scan response. */
  externalUserId?: string | null;
  /** Id field on open platform qr auth scan response. */
  id: string;
  /** Ip hash field on open platform qr auth scan response. */
  ipHash?: string;
  /** Scan source field on open platform qr auth scan response. */
  scanSource: 'app' | 'browser' | 'mini_app' | 'official_account' | 'webhook';
  /** Session id field on open platform qr auth scan response. */
  sessionId: string;
  /** Session key field on open platform qr auth scan response. */
  sessionKey: string;
  /** User agent field on open platform qr auth scan response. */
  userAgent?: string;
}
