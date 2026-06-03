import type { JsonValue } from './json-value';

/** Ai model mapping rule record schema exposed by Claw Router. */
export interface AiModelMappingRuleRecord {
  /** Created at field on ai model mapping rule record. */
  created_at?: string;
  /** Data scope field on ai model mapping rule record. */
  data_scope?: string;
  /** Deleted at field on ai model mapping rule record. */
  deleted_at?: string;
  /** Deleted by field on ai model mapping rule record. */
  deleted_by?: string;
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
  /** Source vendor code field on ai model mapping rule record. */
  source_vendor_code: string;
  /** Source vendor id field on ai model mapping rule record. */
  source_vendor_id?: string;
  /** Status field on ai model mapping rule record. */
  status: string;
  /** Target vendor code field on ai model mapping rule record. */
  target_vendor_code: string;
  /** Target vendor id field on ai model mapping rule record. */
  target_vendor_id?: string;
  /** Tenant id field on ai model mapping rule record. */
  tenant_id: string;
  /** Updated at field on ai model mapping rule record. */
  updated_at?: string;
  /** Uuid field on ai model mapping rule record. */
  uuid: string;
  /** Version field on ai model mapping rule record. */
  version?: string;
}
