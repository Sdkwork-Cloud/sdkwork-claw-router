import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Ai site record schema exposed by Claw Router. */
export interface AiSiteRecord {
  /** Base url field on ai site record. */
  base_url?: string;
  /** Color token field on ai site record. */
  color_token?: string;
  /** Consecutive error count field on ai site record. */
  consecutive_error_count?: string;
  /** Created at field on ai site record. */
  created_at?: string;
  /** Data scope field on ai site record. */
  data_scope?: string;
  /** Deleted at field on ai site record. */
  deleted_at?: string;
  /** Deleted by field on ai site record. */
  deleted_by?: string;
  /** Description field on ai site record. */
  description?: string;
  /** Display name field on ai site record. */
  display_name: string;
  /** Docs url field on ai site record. */
  docs_url?: string;
  /** Environment field on ai site record. */
  environment?: string;
  /** Health status field on ai site record. */
  health_status?: string;
  /** Id field on ai site record. */
  id?: string;
  /** Last checked at field on ai site record. */
  last_checked_at?: string;
  /** Last latency ms field on ai site record. */
  last_latency_ms?: number;
  /** Last sync at field on ai site record. */
  last_sync_at?: string;
  /** Logo field on ai site record. */
  logo?: MediaResource;
  /** Metadata field on ai site record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai site record. */
  organization_id: string;
  /** Owner kind field on ai site record. */
  owner_kind?: string;
  /** Region code field on ai site record. */
  region_code?: string;
  /** Site code field on ai site record. */
  site_code: string;
  /** Site name field on ai site record. */
  site_name: string;
  /** Site type field on ai site record. */
  site_type?: string;
  /** Sort order field on ai site record. */
  sort_order?: number;
  /** Status field on ai site record. */
  status: string;
  /** Tenant id field on ai site record. */
  tenant_id: string;
  /** Updated at field on ai site record. */
  updated_at?: string;
  /** Uuid field on ai site record. */
  uuid: string;
  /** Version field on ai site record. */
  version?: string;
  /** Website url field on ai site record. */
  website_url?: string;
}
