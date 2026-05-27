/** Promotion operation response schema exposed by Claw Router. */
export interface PromotionOperationResponse {
  /** Payment id field on promotion operation response. */
  paymentId?: string | null;
  /** Qr code image url field on promotion operation response. */
  qrCodeImageUrl?: string | null;
  /** Qr code payload field on promotion operation response. */
  qrCodePayload?: string | null;
  /** Request no field on promotion operation response. */
  requestNo: string;
  /** Status field on promotion operation response. */
  status: string;
  /** Success field on promotion operation response. */
  success: boolean;
}
