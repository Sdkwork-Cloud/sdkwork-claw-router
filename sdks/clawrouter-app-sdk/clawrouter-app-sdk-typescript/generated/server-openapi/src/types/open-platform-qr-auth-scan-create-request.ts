/** Open platform qr auth scan create request schema exposed by Claw Router. */
export interface OpenPlatformQrAuthScanCreateRequest {
  /** Account id field on open platform qr auth scan create request. */
  accountId?: string;
  /** Entry id field on open platform qr auth scan create request. */
  entryId?: string;
  /** External user id field on open platform qr auth scan create request. */
  externalUserId?: string;
  /** Ip hash field on open platform qr auth scan create request. */
  ipHash?: string;
  /** Scan source field on open platform qr auth scan create request. */
  scanSource: 'app' | 'browser' | 'mini_app' | 'official_account' | 'webhook';
  /** User agent field on open platform qr auth scan create request. */
  userAgent?: string;
}
