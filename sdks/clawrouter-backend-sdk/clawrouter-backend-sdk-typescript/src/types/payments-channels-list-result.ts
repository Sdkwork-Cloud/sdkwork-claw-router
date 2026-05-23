import type { CommercePaymentChannelListResponse } from './commerce-payment-channel-list-response';

/** Payments channels list result schema exposed by Claw Router. */
export interface PaymentsChannelsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments channels list result. */
  data?: CommercePaymentChannelListResponse;
  /** Human-readable response message. */
  msg?: string;
}
