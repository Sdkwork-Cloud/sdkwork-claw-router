/** Open platform account update request schema exposed by Claw Router. */
export interface OpenPlatformAccountUpdateRequest {
  /** Aes key ref field on open platform account update request. */
  aesKeyRef?: string | null;
  /** App id field on open platform account update request. */
  appId?: string | null;
  /** Default entry id field on open platform account update request. */
  defaultEntryId?: string | null;
  /** Name field on open platform account update request. */
  name?: string;
  /** Qr default field on open platform account update request. */
  qrDefault?: boolean;
  /** Secret ref field on open platform account update request. */
  secretRef?: string | null;
  /** Status field on open platform account update request. */
  status?: 'active' | 'inactive';
  /** Token ref field on open platform account update request. */
  tokenRef?: string | null;
}
