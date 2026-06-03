import type { JsonValue } from './json-value';

/** Ai request trace record schema exposed by Claw Router. */
export interface AiRequestTraceRecord {
  /** Api key id field on ai request trace record. */
  api_key_id?: string;
  /** Api key name snapshot field on ai request trace record. */
  api_key_name_snapshot?: string;
  /** Attempt no field on ai request trace record. */
  attempt_no?: number;
  /** Cached tokens field on ai request trace record. */
  cached_tokens?: string;
  /** Channel group id field on ai request trace record. */
  channel_group_id?: string;
  /** Channel group snapshot field on ai request trace record. */
  channel_group_snapshot?: string;
  /** Channel id field on ai request trace record. */
  channel_id?: string;
  /** Channel name snapshot field on ai request trace record. */
  channel_name_snapshot?: string;
  /** Client ip hash field on ai request trace record. */
  client_ip_hash?: string;
  /** Client ip masked field on ai request trace record. */
  client_ip_masked?: string;
  /** Client ip region field on ai request trace record. */
  client_ip_region?: string;
  /** Completion tokens field on ai request trace record. */
  completion_tokens?: string;
  /** Created at field on ai request trace record. */
  created_at?: string;
  /** Decision log id field on ai request trace record. */
  decision_log_id?: string;
  /** Ended at field on ai request trace record. */
  ended_at?: string;
  /** Endpoint field on ai request trace record. */
  endpoint?: string;
  /** Error message masked field on ai request trace record. */
  error_message_masked?: string;
  /** Error type field on ai request trace record. */
  error_type?: string;
  /** Http method field on ai request trace record. */
  http_method?: string;
  /** Http status field on ai request trace record. */
  http_status?: number;
  /** Id field on ai request trace record. */
  id?: string;
  /** Latency ms field on ai request trace record. */
  latency_ms?: number;
  /** Legacy api key id field on ai request trace record. */
  legacy_api_key_id?: string;
  /** Legal hold field on ai request trace record. */
  legal_hold?: boolean;
  /** Metadata field on ai request trace record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai request trace record. */
  organization_id?: string;
  /** Owner id field on ai request trace record. */
  owner_id?: string;
  /** Owner name snapshot field on ai request trace record. */
  owner_name_snapshot?: string;
  /** Owner type field on ai request trace record. */
  owner_type?: string;
  /** Payload hash field on ai request trace record. */
  payload_hash?: string;
  /** Prompt tokens field on ai request trace record. */
  prompt_tokens?: string;
  /** Provider error code field on ai request trace record. */
  provider_error_code?: string;
  /** Provider id field on ai request trace record. */
  provider_id?: string;
  /** Provider model field on ai request trace record. */
  provider_model?: string;
  /** Provider native model field on ai request trace record. */
  provider_native_model?: string;
  /** Reasoning effort field on ai request trace record. */
  reasoning_effort?: string;
  /** Region code field on ai request trace record. */
  region_code?: string;
  /** Request bytes field on ai request trace record. */
  request_bytes?: string;
  /** Request id field on ai request trace record. */
  request_id?: string;
  /** Request path field on ai request trace record. */
  request_path?: string;
  /** Request payload hash field on ai request trace record. */
  request_payload_hash?: string;
  /** Requested model field on ai request trace record. */
  requested_model?: string;
  /** Requested model catalog key field on ai request trace record. */
  requested_model_catalog_key?: string;
  /** Response bytes field on ai request trace record. */
  response_bytes?: string;
  /** Response payload hash field on ai request trace record. */
  response_payload_hash?: string;
  /** Retention until field on ai request trace record. */
  retention_until?: string;
  /** Started at field on ai request trace record. */
  started_at?: string;
  /** Status field on ai request trace record. */
  status?: string;
  /** Streaming field on ai request trace record. */
  streaming?: boolean;
  /** Tenant id field on ai request trace record. */
  tenant_id?: string;
  /** Total tokens field on ai request trace record. */
  total_tokens?: string;
  /** Trace id field on ai request trace record. */
  trace_id?: string;
  /** Ttft ms field on ai request trace record. */
  ttft_ms?: number;
  /** User agent hash field on ai request trace record. */
  user_agent_hash?: string;
  /** User id field on ai request trace record. */
  user_id?: string;
  /** Uuid field on ai request trace record. */
  uuid?: string;
}
