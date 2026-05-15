import type { JsonValue } from './json-value';

/** Studio catalog action record schema exposed by Claw Router. */
export interface StudioCatalogActionRecord {
  /** Action type field on studio catalog action record. */
  action_type?: string;
  /** Client ip hash field on studio catalog action record. */
  client_ip_hash?: string;
  /** Created at field on studio catalog action record. */
  created_at?: string;
  /** Id field on studio catalog action record. */
  id?: string;
  /** Legal hold field on studio catalog action record. */
  legal_hold?: boolean;
  /** Metadata field on studio catalog action record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on studio catalog action record. */
  organization_id?: string;
  /** Payload hash field on studio catalog action record. */
  payload_hash?: string;
  /** Rating score field on studio catalog action record. */
  rating_score?: string;
  /** Release id field on studio catalog action record. */
  release_id?: string;
  /** Request id field on studio catalog action record. */
  request_id?: string;
  /** Retention until field on studio catalog action record. */
  retention_until?: string;
  /** Review body field on studio catalog action record. */
  review_body?: string;
  /** Review title field on studio catalog action record. */
  review_title?: string;
  /** Status field on studio catalog action record. */
  status?: string;
  /** Target id field on studio catalog action record. */
  target_id?: string;
  /** Target type field on studio catalog action record. */
  target_type?: string;
  /** Tenant id field on studio catalog action record. */
  tenant_id?: string;
  /** Trace id field on studio catalog action record. */
  trace_id?: string;
  /** User agent hash field on studio catalog action record. */
  user_agent_hash?: string;
  /** User id field on studio catalog action record. */
  user_id?: string;
  /** Uuid field on studio catalog action record. */
  uuid?: string;
}
