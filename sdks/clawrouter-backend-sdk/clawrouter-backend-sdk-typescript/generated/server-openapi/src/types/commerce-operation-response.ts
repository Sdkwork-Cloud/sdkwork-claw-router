import type { MediaResource } from './media-resource';

/** Commerce operation response schema exposed by Claw Router. */
export interface CommerceOperationResponse {
  /** Payment id field on commerce operation response. */
  paymentId?: string | null;
  /** Qr code field on commerce operation response. */
  qrCode?: MediaResource;
  /** Qr code payload field on commerce operation response. */
  qrCodePayload?: string | null;
  /** Request no field on commerce operation response. */
  requestNo: string;
  /** Status field on commerce operation response. */
  status: string;
  /** Success field on commerce operation response. */
  success: boolean;
}
