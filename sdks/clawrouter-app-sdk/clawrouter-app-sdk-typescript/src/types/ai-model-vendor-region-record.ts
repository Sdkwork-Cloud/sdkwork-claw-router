import type { JsonValue } from './json-value';

/** Ai model vendor region record schema exposed by Claw Router. */
export interface AiModelVendorRegionRecord {
  /** Billing currency field on ai model vendor region record. */
  billing_currency: string;
  /** Billing jurisdiction field on ai model vendor region record. */
  billing_jurisdiction: string;
  /** Capabilities field on ai model vendor region record. */
  capabilities?: Record<string, JsonValue>;
  /** Country region field on ai model vendor region record. */
  country_region?: string;
  /** Created at field on ai model vendor region record. */
  created_at?: string;
  /** Data scope field on ai model vendor region record. */
  data_scope?: string;
  /** Deleted at field on ai model vendor region record. */
  deleted_at?: string;
  /** Deleted by field on ai model vendor region record. */
  deleted_by?: string;
  /** Description field on ai model vendor region record. */
  description?: string;
  /** Display name field on ai model vendor region record. */
  display_name: string;
  /** Docs url field on ai model vendor region record. */
  docs_url?: string;
  /** Id field on ai model vendor region record. */
  id?: string;
  /** Legal name field on ai model vendor region record. */
  legal_name?: string;
  /** Market scope field on ai model vendor region record. */
  market_scope: string;
  /** Metadata field on ai model vendor region record. */
  metadata?: Record<string, JsonValue>;
  /** Open source field on ai model vendor region record. */
  open_source?: boolean;
  /** Operating regions field on ai model vendor region record. */
  operating_regions: Record<string, JsonValue>;
  /** Organization id field on ai model vendor region record. */
  organization_id: string;
  /** Region code field on ai model vendor region record. */
  region_code: string;
  /** Sort order field on ai model vendor region record. */
  sort_order?: number;
  /** Status field on ai model vendor region record. */
  status: string;
  /** Tenant id field on ai model vendor region record. */
  tenant_id: string;
  /** Updated at field on ai model vendor region record. */
  updated_at?: string;
  /** Uuid field on ai model vendor region record. */
  uuid: string;
  /** Vendor code field on ai model vendor region record. */
  vendor_code: string;
  /** Vendor id field on ai model vendor region record. */
  vendor_id?: string;
  /** Version field on ai model vendor region record. */
  version?: string;
  /** Website url field on ai model vendor region record. */
  website_url?: string;
}
