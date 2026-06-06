import type { MediaResource } from './media-resource';

/** Promotion operation response schema exposed by Claw Router. */
export interface PromotionOperationResponse {
  /** Payment id field on promotion operation response. */
  paymentId?: string | null;
  /** Qr code field on promotion operation response. */
  qrCode?: MediaResource;
  /** Qr code payload field on promotion operation response. */
  qrCodePayload?: string | null;
  /** Request no field on promotion operation response. */
  requestNo: string;
  /** Status field on promotion operation response. */
  status: string;
  /** Success field on promotion operation response. */
  success: boolean;
}
