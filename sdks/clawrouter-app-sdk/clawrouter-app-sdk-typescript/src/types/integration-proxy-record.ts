import type { JsonValue } from './json-value';

/** Integration proxy record schema exposed by Claw Router. */
export interface IntegrationProxyRecord {
  /** Created at field on integration proxy record. */
  created_at?: string;
  /** Data scope field on integration proxy record. */
  data_scope?: string;
  /** Deleted at field on integration proxy record. */
  deleted_at?: string;
  /** Deleted by field on integration proxy record. */
  deleted_by?: string;
  /** Description field on integration proxy record. */
  description?: string;
  /** Endpoint field on integration proxy record. */
  endpoint?: string;
  /** Health status field on integration proxy record. */
  health_status?: string;
  /** Id field on integration proxy record. */
  id?: string;
  /** Last checked at field on integration proxy record. */
  last_checked_at?: string;
  /** Metadata field on integration proxy record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration proxy record. */
  organization_id?: string;
  /** Proxy code field on integration proxy record. */
  proxy_code?: string;
  /** Proxy type field on integration proxy record. */
  proxy_type?: string;
  /** Region field on integration proxy record. */
  region?: string;
  /** Secret hash field on integration proxy record. */
  secret_hash?: string;
  /** Secret ref field on integration proxy record. */
  secret_ref?: string;
  /** Status field on integration proxy record. */
  status?: string;
  /** Tenant id field on integration proxy record. */
  tenant_id?: string;
  /** Updated at field on integration proxy record. */
  updated_at?: string;
  /** Uuid field on integration proxy record. */
  uuid?: string;
  /** Version field on integration proxy record. */
  version?: string;
}
