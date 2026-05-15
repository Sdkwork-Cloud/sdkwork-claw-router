import type { JsonValue } from './json-value';

/** Integration webhook endpoint record schema exposed by Claw Router. */
export interface IntegrationWebhookEndpointRecord {
  /** Created at field on integration webhook endpoint record. */
  created_at?: string;
  /** Data scope field on integration webhook endpoint record. */
  data_scope?: string;
  /** Deleted at field on integration webhook endpoint record. */
  deleted_at?: string;
  /** Deleted by field on integration webhook endpoint record. */
  deleted_by?: string;
  /** Endpoint code field on integration webhook endpoint record. */
  endpoint_code?: string;
  /** Event types field on integration webhook endpoint record. */
  event_types?: Record<string, JsonValue>;
  /** Failure count field on integration webhook endpoint record. */
  failure_count?: string;
  /** Id field on integration webhook endpoint record. */
  id?: string;
  /** Last failure at field on integration webhook endpoint record. */
  last_failure_at?: string;
  /** Last success at field on integration webhook endpoint record. */
  last_success_at?: string;
  /** Metadata field on integration webhook endpoint record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on integration webhook endpoint record. */
  name?: string;
  /** Organization id field on integration webhook endpoint record. */
  organization_id?: string;
  /** Owner id field on integration webhook endpoint record. */
  owner_id?: string;
  /** Owner type field on integration webhook endpoint record. */
  owner_type?: string;
  /** Retry policy field on integration webhook endpoint record. */
  retry_policy?: Record<string, JsonValue>;
  /** Secret hash field on integration webhook endpoint record. */
  secret_hash?: string;
  /** Secret ref field on integration webhook endpoint record. */
  secret_ref?: string;
  /** Signing alg field on integration webhook endpoint record. */
  signing_alg?: string;
  /** Status field on integration webhook endpoint record. */
  status?: string;
  /** Target url field on integration webhook endpoint record. */
  target_url?: string;
  /** Tenant id field on integration webhook endpoint record. */
  tenant_id?: string;
  /** Updated at field on integration webhook endpoint record. */
  updated_at?: string;
  /** User id field on integration webhook endpoint record. */
  user_id?: string;
  /** Uuid field on integration webhook endpoint record. */
  uuid?: string;
  /** Version field on integration webhook endpoint record. */
  version?: string;
}
