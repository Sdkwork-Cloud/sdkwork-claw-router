/** Open platform entry item schema exposed by Claw Router. */
export interface OpenPlatformEntryItem {
  /** Account id field on open platform entry item. */
  accountId: string;
  /** Created at field on open platform entry item. */
  createdAt?: string;
  /** Id field on open platform entry item. */
  id: string;
  /** Key field on open platform entry item. */
  key: string;
  /** Status field on open platform entry item. */
  status: 'active' | 'inactive';
  /** Type field on open platform entry item. */
  type: 'url' | 'qr' | 'mini_app_url';
  /** Updated at field on open platform entry item. */
  updatedAt?: string;
  /** Url field on open platform entry item. */
  url: string;
}
