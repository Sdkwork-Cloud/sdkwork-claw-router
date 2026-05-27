import type { JsonValue } from './json-value';

/** Object provider record schema exposed by Claw Router. */
export interface ObjectProviderRecord {
  /** Created at field on object provider record. */
  created_at?: string;
  /** Credential ref field on object provider record. */
  credential_ref?: string;
  /** Data scope field on object provider record. */
  data_scope?: string;
  /** Deleted at field on object provider record. */
  deleted_at?: string;
  /** Deleted by field on object provider record. */
  deleted_by?: string;
  /** Endpoint url field on object provider record. */
  endpoint_url?: string;
  /** Id field on object provider record. */
  id?: string;
  /** Idempotency key field on object provider record. */
  idempotency_key?: string;
  /** Last health check at field on object provider record. */
  last_health_check_at?: string;
  /** Metadata field on object provider record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on object provider record. */
  organization_id?: string;
  /** Provider code field on object provider record. */
  provider_code?: string;
  /** Provider type field on object provider record. */
  provider_type?: string;
  /** Region field on object provider record. */
  region?: string;
  /** Request id field on object provider record. */
  request_id?: string;
  /** Status field on object provider record. */
  status?: string;
  /** Tenant id field on object provider record. */
  tenant_id?: string;
  /** Updated at field on object provider record. */
  updated_at?: string;
  /** Uuid field on object provider record. */
  uuid?: string;
  /** Version field on object provider record. */
  version?: string;
}
