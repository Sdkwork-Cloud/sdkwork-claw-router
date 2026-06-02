import type { JsonValue } from './json-value';

/** Ai runtime artifact record schema exposed by Claw Router. */
export interface AiRuntimeArtifactRecord {
  /** Agent run id field on ai runtime artifact record. */
  agent_run_id?: string;
  /** Agent run step id field on ai runtime artifact record. */
  agent_run_step_id?: string;
  /** Agent session id field on ai runtime artifact record. */
  agent_session_id?: string;
  /** Artifact type field on ai runtime artifact record. */
  artifact_type?: string;
  /** Chat item id field on ai runtime artifact record. */
  chat_item_id?: string;
  /** Chat turn id field on ai runtime artifact record. */
  chat_turn_id?: string;
  /** Content json field on ai runtime artifact record. */
  content_json?: Record<string, JsonValue>;
  /** Content text field on ai runtime artifact record. */
  content_text?: string;
  /** Conversation id field on ai runtime artifact record. */
  conversation_id?: string;
  /** Created at field on ai runtime artifact record. */
  created_at?: string;
  /** Id field on ai runtime artifact record. */
  id?: string;
  /** Legal hold field on ai runtime artifact record. */
  legal_hold?: boolean;
  /** Media resource id field on ai runtime artifact record. */
  media_resource_id?: string;
  /** Message id field on ai runtime artifact record. */
  message_id?: string;
  /** Metadata field on ai runtime artifact record. */
  metadata?: Record<string, JsonValue>;
  /** Mime type field on ai runtime artifact record. */
  mime_type?: string;
  /** Name field on ai runtime artifact record. */
  name?: string;
  /** Object blob id field on ai runtime artifact record. */
  object_blob_id?: string;
  /** Organization id field on ai runtime artifact record. */
  organization_id?: string;
  /** Payload hash field on ai runtime artifact record. */
  payload_hash?: string;
  /** Request id field on ai runtime artifact record. */
  request_id?: string;
  /** Resource snapshot field on ai runtime artifact record. */
  resource_snapshot?: Record<string, JsonValue>;
  /** Retention until field on ai runtime artifact record. */
  retention_until?: string;
  /** Runtime invocation id field on ai runtime artifact record. */
  runtime_invocation_id?: string;
  /** Sha 256 field on ai runtime artifact record. */
  sha256?: string;
  /** Size bytes field on ai runtime artifact record. */
  size_bytes?: string;
  /** Status field on ai runtime artifact record. */
  status?: string;
  /** Tenant id field on ai runtime artifact record. */
  tenant_id?: string;
  /** Trace id field on ai runtime artifact record. */
  trace_id?: string;
  /** User id field on ai runtime artifact record. */
  user_id?: string;
  /** Uuid field on ai runtime artifact record. */
  uuid?: string;
}
