/** Open platform pay binding item schema exposed by Claw Router. */
export interface OpenPlatformPayBindingItem {
  /** Account id field on open platform pay binding item. */
  accountId: string;
  /** Created at field on open platform pay binding item. */
  createdAt?: string;
  /** Id field on open platform pay binding item. */
  id: string;
  /** Mode field on open platform pay binding item. */
  mode: 'direct' | 'cashier' | 'escrow';
  /** Payment account id field on open platform pay binding item. */
  paymentAccountId: string;
  /** Payment channel id field on open platform pay binding item. */
  paymentChannelId?: string | null;
  /** Scene field on open platform pay binding item. */
  scene: 'official_account' | 'mini_app' | 'h5' | 'app';
  /** Status field on open platform pay binding item. */
  status: 'active' | 'inactive';
  /** Updated at field on open platform pay binding item. */
  updatedAt?: string;
}
