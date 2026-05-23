/** Commerce operation response schema exposed by Claw Router. */
export interface CommerceOperationResponse {
  /** Payment id field on commerce operation response. */
  paymentId?: string | null;
  /** Qr code image url field on commerce operation response. */
  qrCodeImageUrl?: string | null;
  /** Qr code payload field on commerce operation response. */
  qrCodePayload?: string | null;
  /** Request no field on commerce operation response. */
  requestNo: string;
  /** Status field on commerce operation response. */
  status: string;
  /** Success field on commerce operation response. */
  success: boolean;
}
