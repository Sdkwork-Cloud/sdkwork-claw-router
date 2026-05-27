/** Messaging test send response schema exposed by Claw Router. */
export interface MessagingTestSendResponse {
  /** Delivery status field on messaging test send response. */
  deliveryStatus: string;
  /** Provider code field on messaging test send response. */
  providerCode?: string | null;
  /** Request id field on messaging test send response. */
  requestId: string;
}
