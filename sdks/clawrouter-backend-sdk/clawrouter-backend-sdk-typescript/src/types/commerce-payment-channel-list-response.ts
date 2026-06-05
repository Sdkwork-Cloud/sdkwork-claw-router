import type { CommercePaymentChannelItem } from './commerce-payment-channel-item';

/** Commerce payment channel list response schema exposed by Claw Router. */
export interface CommercePaymentChannelListResponse {
  /** Items field on commerce payment channel list response. */
  items: CommercePaymentChannelItem[];
  /** Page field on commerce payment channel list response. */
  page: string;
  /** Page size field on commerce payment channel list response. */
  pageSize: string;
  /** Total field on commerce payment channel list response. */
  total: string;
}
