import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Ai model vendor record schema exposed by Claw Router. */
export interface AiModelVendorRecord {
  /** Capabilities field on ai model vendor record. */
  capabilities?: Record<string, JsonValue>;
  /** Client api compatibility field on ai model vendor record. */
  client_api_compatibility?: Record<string, JsonValue>;
  /** Color token field on ai model vendor record. */
  color_token?: string;
  /** Country region field on ai model vendor record. */
  country_region?: string;
  /** Created at field on ai model vendor record. */
  created_at?: string;
  /** Data scope field on ai model vendor record. */
  data_scope?: string;
  /** Deleted at field on ai model vendor record. */
  deleted_at?: string;
  /** Deleted by field on ai model vendor record. */
  deleted_by?: string;
  /** Description field on ai model vendor record. */
  description?: string;
  /** Display name field on ai model vendor record. */
  display_name: string;
  /** Docs url field on ai model vendor record. */
  docs_url?: string;
  /** Icon field on ai model vendor record. */
  icon?: MediaResource;
  /** Id field on ai model vendor record. */
  id?: string;
  /** Legal name field on ai model vendor record. */
  legal_name?: string;
  /** Logo field on ai model vendor record. */
  logo?: MediaResource;
  /** Metadata field on ai model vendor record. */
  metadata?: Record<string, JsonValue>;
  /** Model families field on ai model vendor record. */
  model_families?: Record<string, JsonValue>;
  /** Open source field on ai model vendor record. */
  open_source?: boolean;
  /** Organization id field on ai model vendor record. */
  organization_id: string;
  /** Sort order field on ai model vendor record. */
  sort_order?: number;
  /** Status field on ai model vendor record. */
  status: string;
  /** Supported protocols field on ai model vendor record. */
  supported_protocols?: Record<string, JsonValue>;
  /** Tenant id field on ai model vendor record. */
  tenant_id: string;
  /** Updated at field on ai model vendor record. */
  updated_at?: string;
  /** Uuid field on ai model vendor record. */
  uuid: string;
  /** Vendor code field on ai model vendor record. */
  vendor_code: string;
  /** Vendor type field on ai model vendor record. */
  vendor_type?: string;
  /** Version field on ai model vendor record. */
  version?: string;
  /** Website url field on ai model vendor record. */
  website_url?: string;
}
