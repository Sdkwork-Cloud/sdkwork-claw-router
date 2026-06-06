/** Open platform entry create request schema exposed by Claw Router. */
export interface OpenPlatformEntryCreateRequest {
  /** Key field on open platform entry create request. */
  key: string;
  /** Type field on open platform entry create request. */
  type: 'url' | 'qr' | 'mini_app_url';
  /** Url field on open platform entry create request. */
  url: string;
}
