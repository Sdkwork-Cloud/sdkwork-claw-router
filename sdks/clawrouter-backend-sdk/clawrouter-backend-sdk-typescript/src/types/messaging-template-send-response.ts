/** Messaging template send response schema exposed by Claw Router. */
export interface MessagingTemplateSendResponse {
  /** Delivery status field on messaging template send response. */
  deliveryStatus: string;
  /** Provider code field on messaging template send response. */
  providerCode?: string | null;
  /** Request id field on messaging template send response. */
  requestId: string;
}
