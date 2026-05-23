import type { JsonValue } from './json-value';

/** Integration channel record schema exposed by Claw Router. */
export interface IntegrationChannelRecord {
  /** Access type field on integration channel record. */
  access_type?: string;
  /** Account id field on integration channel record. */
  account_id?: string;
  /** Base url field on integration channel record. */
  base_url?: string;
  /** Capabilities field on integration channel record. */
  capabilities?: Record<string, JsonValue>;
  /** Channel code field on integration channel record. */
  channel_code?: string;
  /** Circuit breaker policy field on integration channel record. */
  circuit_breaker_policy?: Record<string, JsonValue>;
  /** Consecutive error count field on integration channel record. */
  consecutive_error_count?: string;
  /** Created at field on integration channel record. */
  created_at?: string;
  /** Data scope field on integration channel record. */
  data_scope?: string;
  /** Deleted at field on integration channel record. */
  deleted_at?: string;
  /** Deleted by field on integration channel record. */
  deleted_by?: string;
  /** Environment field on integration channel record. */
  environment?: string;
  /** Health status field on integration channel record. */
  health_status?: string;
  /** Id field on integration channel record. */
  id?: string;
  /** Last latency ms field on integration channel record. */
  last_latency_ms?: number;
  /** Metadata field on integration channel record. */
  metadata?: Record<string, JsonValue>;
  /** Model mode field on integration channel record. */
  model_mode?: string;
  /** Name field on integration channel record. */
  name?: string;
  /** Organization id field on integration channel record. */
  organization_id?: string;
  /** Priority field on integration channel record. */
  priority?: number;
  /** Protocol field on integration channel record. */
  protocol?: string;
  /** Provider code field on integration channel record. */
  provider_code?: string;
  /** Provider id field on integration channel record. */
  provider_id?: string;
  /** Proxy id field on integration channel record. */
  proxy_id?: string;
  /** Region field on integration channel record. */
  region?: string;
  /** Retry policy field on integration channel record. */
  retry_policy?: Record<string, JsonValue>;
  /** Rpm limit field on integration channel record. */
  rpm_limit?: string;
  /** Status field on integration channel record. */
  status?: string;
  /** Tenant id field on integration channel record. */
  tenant_id?: string;
  /** Timeout ms field on integration channel record. */
  timeout_ms?: number;
  /** Updated at field on integration channel record. */
  updated_at?: string;
  /** Uuid field on integration channel record. */
  uuid?: string;
  /** Version field on integration channel record. */
  version?: string;
  /** Weight field on integration channel record. */
  weight?: number;
}
