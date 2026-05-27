/** Open platform account update request schema exposed by Claw Router. */
export interface OpenPlatformAccountUpdateRequest {
  /** App id field on open platform account update request. */
  appId?: string | null;
  /** App secret field on open platform account update request. */
  appSecret?: string | null;
  /** Default entry id field on open platform account update request. */
  defaultEntryId?: string | null;
  /** Encoding aes key field on open platform account update request. */
  encodingAesKey?: string | null;
  /** Name field on open platform account update request. */
  name?: string;
  /** Qr default field on open platform account update request. */
  qrDefault?: boolean;
  /** Status field on open platform account update request. */
  status?: 'active' | 'inactive';
  /** Token field on open platform account update request. */
  token?: string | null;
}
