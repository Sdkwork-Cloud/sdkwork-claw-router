/** Open platform entry update request schema exposed by Claw Router. */
export interface OpenPlatformEntryUpdateRequest {
  /** Key field on open platform entry update request. */
  key?: string;
  /** Status field on open platform entry update request. */
  status?: 'active' | 'inactive';
  /** Type field on open platform entry update request. */
  type?: 'url' | 'qr' | 'mini_app_url';
  /** Url field on open platform entry update request. */
  url?: string;
}
