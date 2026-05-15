import type { JsonValue } from './json-value';

/** Ai generation job record schema exposed by Claw Router. */
export interface AiGenerationJobRecord {
  /** Channel id field on ai generation job record. */
  channel_id?: string;
  /** Completed at field on ai generation job record. */
  completed_at?: string;
  /** Created at field on ai generation job record. */
  created_at?: string;
  /** Failure code field on ai generation job record. */
  failure_code?: string;
  /** Failure message masked field on ai generation job record. */
  failure_message_masked?: string;
  /** Id field on ai generation job record. */
  id?: string;
  /** Input asset ids field on ai generation job record. */
  input_asset_ids?: Record<string, JsonValue>;
  /** Job type field on ai generation job record. */
  job_type?: string;
  /** Legal hold field on ai generation job record. */
  legal_hold?: boolean;
  /** Metadata field on ai generation job record. */
  metadata?: Record<string, JsonValue>;
  /** Modality field on ai generation job record. */
  modality?: string;
  /** Model field on ai generation job record. */
  model?: string;
  /** Negative prompt field on ai generation job record. */
  negative_prompt?: string;
  /** Organization id field on ai generation job record. */
  organization_id?: string;
  /** Parameter snapshot field on ai generation job record. */
  parameter_snapshot?: Record<string, JsonValue>;
  /** Payload hash field on ai generation job record. */
  payload_hash?: string;
  /** Progress percent field on ai generation job record. */
  progress_percent?: number;
  /** Prompt field on ai generation job record. */
  prompt?: string;
  /** Provider id field on ai generation job record. */
  provider_id?: string;
  /** Request id field on ai generation job record. */
  request_id?: string;
  /** Retention until field on ai generation job record. */
  retention_until?: string;
  /** Session id field on ai generation job record. */
  session_id?: string;
  /** Started at field on ai generation job record. */
  started_at?: string;
  /** Status field on ai generation job record. */
  status?: string;
  /** Tenant id field on ai generation job record. */
  tenant_id?: string;
  /** Trace id field on ai generation job record. */
  trace_id?: string;
  /** Usage fact id field on ai generation job record. */
  usage_fact_id?: string;
  /** User id field on ai generation job record. */
  user_id?: string;
  /** Uuid field on ai generation job record. */
  uuid?: string;
}
