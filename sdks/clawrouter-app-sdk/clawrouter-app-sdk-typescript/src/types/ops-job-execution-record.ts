import type { JsonValue } from './json-value';

/** Ops job execution record schema exposed by Claw Router. */
export interface OpsJobExecutionRecord {
  /** Created at field on ops job execution record. */
  created_at?: string;
  /** Duration ms field on ops job execution record. */
  duration_ms?: string;
  /** Ended at field on ops job execution record. */
  ended_at?: string;
  /** Execution status field on ops job execution record. */
  execution_status?: string;
  /** Failure count field on ops job execution record. */
  failure_count?: string;
  /** Failure reason field on ops job execution record. */
  failure_reason?: string;
  /** Id field on ops job execution record. */
  id?: string;
  /** Job name field on ops job execution record. */
  job_name?: string;
  /** Job type field on ops job execution record. */
  job_type?: string;
  /** Legal hold field on ops job execution record. */
  legal_hold?: boolean;
  /** Metadata field on ops job execution record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ops job execution record. */
  organization_id?: string;
  /** Payload field on ops job execution record. */
  payload?: Record<string, JsonValue>;
  /** Payload hash field on ops job execution record. */
  payload_hash?: string;
  /** Processed count field on ops job execution record. */
  processed_count?: string;
  /** Request id field on ops job execution record. */
  request_id?: string;
  /** Retention until field on ops job execution record. */
  retention_until?: string;
  /** Started at field on ops job execution record. */
  started_at?: string;
  /** Status field on ops job execution record. */
  status?: string;
  /** Success count field on ops job execution record. */
  success_count?: string;
  /** Tenant id field on ops job execution record. */
  tenant_id?: string;
  /** Trace id field on ops job execution record. */
  trace_id?: string;
  /** Trigger type field on ops job execution record. */
  trigger_type?: string;
  /** User id field on ops job execution record. */
  user_id?: string;
  /** Uuid field on ops job execution record. */
  uuid?: string;
}
