import type { JsonValue } from './json-value';

/** Ai config change event record schema exposed by Claw Router. */
export interface AiConfigChangeEventRecord {
  /** Changed object id field on ai config change event record. */
  changed_object_id?: string;
  /** Changed object type field on ai config change event record. */
  changed_object_type?: string;
  /** Config scope field on ai config change event record. */
  config_scope: string;
  /** Config version field on ai config change event record. */
  config_version: string;
  /** Created at field on ai config change event record. */
  created_at?: string;
  /** Event payload field on ai config change event record. */
  event_payload?: Record<string, JsonValue>;
  /** Event status field on ai config change event record. */
  event_status: string;
  /** Id field on ai config change event record. */
  id?: string;
  /** Last error message field on ai config change event record. */
  last_error_message?: string;
  /** Legal hold field on ai config change event record. */
  legal_hold?: boolean;
  /** Metadata field on ai config change event record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai config change event record. */
  organization_id: string;
  /** Payload hash field on ai config change event record. */
  payload_hash?: string;
  /** Publish attempts field on ai config change event record. */
  publish_attempts?: number;
  /** Published at field on ai config change event record. */
  published_at?: string;
  /** Request id field on ai config change event record. */
  request_id?: string;
  /** Retention until field on ai config change event record. */
  retention_until?: string;
  /** Status field on ai config change event record. */
  status: string;
  /** Tenant id field on ai config change event record. */
  tenant_id: string;
  /** Trace id field on ai config change event record. */
  trace_id?: string;
  /** User id field on ai config change event record. */
  user_id?: string;
  /** Uuid field on ai config change event record. */
  uuid: string;
}
