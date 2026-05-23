import type { JsonValue } from './json-value';

/** Open platform provider record schema exposed by Claw Router. */
export interface OpenPlatformProviderRecord {
  /** Capabilities field on open platform provider record. */
  capabilities?: Record<string, JsonValue>;
  /** Created at field on open platform provider record. */
  created_at?: string;
  /** Data scope field on open platform provider record. */
  data_scope?: string;
  /** Deleted at field on open platform provider record. */
  deleted_at?: string;
  /** Deleted by field on open platform provider record. */
  deleted_by?: string;
  /** Docs url field on open platform provider record. */
  docs_url?: string;
  /** Icon url field on open platform provider record. */
  icon_url?: string;
  /** Id field on open platform provider record. */
  id?: string;
  /** Metadata field on open platform provider record. */
  metadata?: Record<string, JsonValue>;
  /** Name field on open platform provider record. */
  name?: string;
  /** Organization id field on open platform provider record. */
  organization_id?: string;
  /** Provider field on open platform provider record. */
  provider?: string;
  /** Sort order field on open platform provider record. */
  sort_order?: number;
  /** Status field on open platform provider record. */
  status?: string;
  /** Tenant id field on open platform provider record. */
  tenant_id?: string;
  /** Updated at field on open platform provider record. */
  updated_at?: string;
  /** Uuid field on open platform provider record. */
  uuid?: string;
  /** Version field on open platform provider record. */
  version?: string;
  /** Website url field on open platform provider record. */
  website_url?: string;
}
