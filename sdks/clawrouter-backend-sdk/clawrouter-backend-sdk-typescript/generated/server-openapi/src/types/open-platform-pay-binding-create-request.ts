/** Open platform pay binding create request schema exposed by Claw Router. */
export interface OpenPlatformPayBindingCreateRequest {
  /** Mode field on open platform pay binding create request. */
  mode: 'direct' | 'cashier' | 'escrow';
  /** Payment account id field on open platform pay binding create request. */
  paymentAccountId: string;
  /** Payment channel id field on open platform pay binding create request. */
  paymentChannelId?: string | null;
  /** Scene field on open platform pay binding create request. */
  scene: 'official_account' | 'mini_app' | 'h5' | 'app';
}
