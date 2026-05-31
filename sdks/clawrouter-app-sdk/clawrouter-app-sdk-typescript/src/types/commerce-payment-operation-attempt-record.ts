/** Commerce payment operation attempt record schema exposed by Claw Router. */
export interface CommercePaymentOperationAttemptRecord {
  /** Channel id field on commerce payment operation attempt record. */
  channel_id?: string;
  /** Completed at field on commerce payment operation attempt record. */
  completed_at?: string;
  /** Created at field on commerce payment operation attempt record. */
  created_at: string;
  /** Http status field on commerce payment operation attempt record. */
  http_status?: string;
  /** Idempotency key field on commerce payment operation attempt record. */
  idempotency_key: string;
  /** Native refund id field on commerce payment operation attempt record. */
  native_refund_id?: string;
  /** Native request id field on commerce payment operation attempt record. */
  native_request_id?: string;
  /** Native trade id field on commerce payment operation attempt record. */
  native_trade_id?: string;
  /** Operation code field on commerce payment operation attempt record. */
  operation_code: string;
  /** Operation no field on commerce payment operation attempt record. */
  operation_no: string;
  /** Organization id field on commerce payment operation attempt record. */
  organization_id?: string;
  /** Provider account id field on commerce payment operation attempt record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment operation attempt record. */
  provider_code: string;
  /** Provider error code field on commerce payment operation attempt record. */
  provider_error_code?: string;
  /** Provider error message field on commerce payment operation attempt record. */
  provider_error_message?: string;
  /** Request digest field on commerce payment operation attempt record. */
  request_digest: string;
  /** Response digest field on commerce payment operation attempt record. */
  response_digest?: string;
  /** Retryable field on commerce payment operation attempt record. */
  retryable?: string;
  /** Sdkwork resource id field on commerce payment operation attempt record. */
  sdkwork_resource_id: string;
  /** Sdkwork resource type field on commerce payment operation attempt record. */
  sdkwork_resource_type: string;
  /** Started at field on commerce payment operation attempt record. */
  started_at: string;
  /** Status field on commerce payment operation attempt record. */
  status: string;
  /** Tenant id field on commerce payment operation attempt record. */
  tenant_id: string;
}
