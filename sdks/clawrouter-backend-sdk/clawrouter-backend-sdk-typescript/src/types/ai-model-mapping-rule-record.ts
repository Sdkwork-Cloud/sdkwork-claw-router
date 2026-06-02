import type { JsonValue } from './json-value';

/** Ai model mapping rule record schema exposed by Claw Router. */
export interface AiModelMappingRuleRecord {
  /** Channel code field on ai model mapping rule record. */
  channel_code?: string;
  /** Channel id field on ai model mapping rule record. */
  channel_id?: string;
  /** Created at field on ai model mapping rule record. */
  created_at?: string;
  /** Data scope field on ai model mapping rule record. */
  data_scope?: string;
  /** Deleted at field on ai model mapping rule record. */
  deleted_at?: string;
  /** Deleted by field on ai model mapping rule record. */
  deleted_by?: string;
  /** Description field on ai model mapping rule record. */
  description?: string;
  /** Effective from field on ai model mapping rule record. */
  effective_from?: string;
  /** Effective to field on ai model mapping rule record. */
  effective_to?: string;
  /** Enabled field on ai model mapping rule record. */
  enabled: boolean;
  /** Id field on ai model mapping rule record. */
  id?: string;
  /** Mapping mode field on ai model mapping rule record. */
  mapping_mode: string;
  /** Match type field on ai model mapping rule record. */
  match_type: string;
  /** Metadata field on ai model mapping rule record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai model mapping rule record. */
  organization_id: string;
  /** Priority field on ai model mapping rule record. */
  priority: number;
  /** Scope type field on ai model mapping rule record. */
  scope_type: string;
  /** Source catalog key field on ai model mapping rule record. */
  source_catalog_key?: string;
  /** Source model field on ai model mapping rule record. */
  source_model: string;
  /** Source vendor code field on ai model mapping rule record. */
  source_vendor_code?: string;
  /** Status field on ai model mapping rule record. */
  status: string;
  /** Target catalog key field on ai model mapping rule record. */
  target_catalog_key?: string;
  /** Target model field on ai model mapping rule record. */
  target_model: string;
  /** Target provider model field on ai model mapping rule record. */
  target_provider_model?: string;
  /** Target provider native model field on ai model mapping rule record. */
  target_provider_native_model?: string;
  /** Target vendor code field on ai model mapping rule record. */
  target_vendor_code?: string;
  /** Tenant id field on ai model mapping rule record. */
  tenant_id: string;
  /** Updated at field on ai model mapping rule record. */
  updated_at?: string;
  /** Uuid field on ai model mapping rule record. */
  uuid: string;
  /** Vendor code field on ai model mapping rule record. */
  vendor_code?: string;
  /** Vendor id field on ai model mapping rule record. */
  vendor_id?: string;
  /** Version field on ai model mapping rule record. */
  version?: string;
}
