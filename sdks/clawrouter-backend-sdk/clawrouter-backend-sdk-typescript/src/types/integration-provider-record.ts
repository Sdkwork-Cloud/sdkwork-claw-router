import type { JsonValue } from './json-value';

/** Integration provider record schema exposed by Claw Router. */
export interface IntegrationProviderRecord {
  /** Auth type field on integration provider record. */
  auth_type?: string;
  /** Base url template field on integration provider record. */
  base_url_template?: string;
  /** Capabilities field on integration provider record. */
  capabilities?: Record<string, JsonValue>;
  /** Color token field on integration provider record. */
  color_token?: string;
  /** Created at field on integration provider record. */
  created_at?: string;
  /** Data scope field on integration provider record. */
  data_scope?: string;
  /** Default vendor code field on integration provider record. */
  default_vendor_code?: string;
  /** Deleted at field on integration provider record. */
  deleted_at?: string;
  /** Deleted by field on integration provider record. */
  deleted_by?: string;
  /** Description field on integration provider record. */
  description?: string;
  /** Display name field on integration provider record. */
  display_name?: string;
  /** Docs url field on integration provider record. */
  docs_url?: string;
  /** Icon url field on integration provider record. */
  icon_url?: string;
  /** Id field on integration provider record. */
  id?: string;
  /** Integration type field on integration provider record. */
  integration_type?: string;
  /** Metadata field on integration provider record. */
  metadata?: Record<string, JsonValue>;
  /** Metadata schema version field on integration provider record. */
  metadata_schema_version?: string;
  /** Organization id field on integration provider record. */
  organization_id?: string;
  /** Protocol field on integration provider record. */
  protocol?: string;
  /** Provider code field on integration provider record. */
  provider_code?: string;
  /** Sort order field on integration provider record. */
  sort_order?: number;
  /** Status field on integration provider record. */
  status?: string;
  /** Tenant id field on integration provider record. */
  tenant_id?: string;
  /** Updated at field on integration provider record. */
  updated_at?: string;
  /** Upstream provider code field on integration provider record. */
  upstream_provider_code?: string;
  /** Upstream vendor code field on integration provider record. */
  upstream_vendor_code?: string;
  /** Uuid field on integration provider record. */
  uuid?: string;
  /** Version field on integration provider record. */
  version?: string;
  /** Website url field on integration provider record. */
  website_url?: string;
}
