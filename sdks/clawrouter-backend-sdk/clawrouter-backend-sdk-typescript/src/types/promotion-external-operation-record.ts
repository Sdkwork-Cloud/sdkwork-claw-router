import type { JsonValue } from './json-value';

/** Promotion external operation record schema exposed by Claw Router. */
export interface PromotionExternalOperationRecord {
  /** Aggregate id field on promotion external operation record. */
  aggregate_id: string;
  /** Aggregate type field on promotion external operation record. */
  aggregate_type: string;
  /** Binding id field on promotion external operation record. */
  binding_id?: string;
  /** Callback at field on promotion external operation record. */
  callback_at?: string;
  /** Callback id field on promotion external operation record. */
  callback_id?: string;
  /** Callback sig hash field on promotion external operation record. */
  callback_sig_hash?: string;
  /** Cancel until field on promotion external operation record. */
  cancel_until?: string;
  /** Created at field on promotion external operation record. */
  created_at: string;
  /** Error code field on promotion external operation record. */
  error_code?: string;
  /** Error message field on promotion external operation record. */
  error_message?: string;
  /** External operation id field on promotion external operation record. */
  external_operation_id?: string;
  /** External request no field on promotion external operation record. */
  external_request_no?: string;
  /** External status field on promotion external operation record. */
  external_status?: string;
  /** Id field on promotion external operation record. */
  id?: string;
  /** Idempotency key field on promotion external operation record. */
  idempotency_key: string;
  /** Next retry at field on promotion external operation record. */
  next_retry_at?: string;
  /** Occurred at field on promotion external operation record. */
  occurred_at: string;
  /** Operation no field on promotion external operation record. */
  operation_no: string;
  /** Operation type field on promotion external operation record. */
  operation_type: string;
  /** Organization id field on promotion external operation record. */
  organization_id?: string;
  /** Platform field on promotion external operation record. */
  platform: string;
  /** Provider code field on promotion external operation record. */
  provider_code?: string;
  /** Provider request id field on promotion external operation record. */
  provider_request_id?: string;
  /** Replay op id field on promotion external operation record. */
  replay_op_id?: string;
  /** Request hash field on promotion external operation record. */
  request_hash?: string;
  /** Response hash field on promotion external operation record. */
  response_hash?: string;
  /** Retry count field on promotion external operation record. */
  retry_count: number;
  /** Sanitized request json field on promotion external operation record. */
  sanitized_request_json: Record<string, JsonValue>;
  /** Sanitized response json field on promotion external operation record. */
  sanitized_response_json: Record<string, JsonValue>;
  /** Status field on promotion external operation record. */
  status: string;
  /** Tenant id field on promotion external operation record. */
  tenant_id: string;
}
