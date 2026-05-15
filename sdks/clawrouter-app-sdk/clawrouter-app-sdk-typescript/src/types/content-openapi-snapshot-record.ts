import type { JsonValue } from './json-value';

/** Content openapi snapshot record schema exposed by Claw Router. */
export interface ContentOpenapiSnapshotRecord {
  /** Api surface field on content openapi snapshot record. */
  api_surface?: string;
  /** Api system field on content openapi snapshot record. */
  api_system?: string;
  /** Category tree field on content openapi snapshot record. */
  category_tree?: Record<string, JsonValue>;
  /** Created at field on content openapi snapshot record. */
  created_at?: string;
  /** Endpoint count field on content openapi snapshot record. */
  endpoint_count?: number;
  /** Example manifest field on content openapi snapshot record. */
  example_manifest?: Record<string, JsonValue>;
  /** Id field on content openapi snapshot record. */
  id?: string;
  /** Metadata field on content openapi snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Openapi hash field on content openapi snapshot record. */
  openapi_hash?: string;
  /** Organization id field on content openapi snapshot record. */
  organization_id?: string;
  /** Published at field on content openapi snapshot record. */
  published_at?: string;
  /** Rebuild version field on content openapi snapshot record. */
  rebuild_version?: string;
  /** Source id field on content openapi snapshot record. */
  source_id?: string;
  /** Source ref field on content openapi snapshot record. */
  source_ref?: string;
  /** Source type field on content openapi snapshot record. */
  source_type?: string;
  /** Source version field on content openapi snapshot record. */
  source_version?: string;
  /** Status field on content openapi snapshot record. */
  status?: string;
  /** Tenant id field on content openapi snapshot record. */
  tenant_id?: string;
  /** Title field on content openapi snapshot record. */
  title?: string;
  /** Updated at field on content openapi snapshot record. */
  updated_at?: string;
  /** Uuid field on content openapi snapshot record. */
  uuid?: string;
  /** Version field on content openapi snapshot record. */
  version?: string;
}
