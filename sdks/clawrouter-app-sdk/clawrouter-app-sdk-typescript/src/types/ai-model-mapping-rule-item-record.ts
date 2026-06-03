import type { JsonValue } from './json-value';

/** Ai model mapping rule item record schema exposed by Claw Router. */
export interface AiModelMappingRuleItemRecord {
  /** Created at field on ai model mapping rule item record. */
  created_at?: string;
  /** Data scope field on ai model mapping rule item record. */
  data_scope?: string;
  /** Deleted at field on ai model mapping rule item record. */
  deleted_at?: string;
  /** Deleted by field on ai model mapping rule item record. */
  deleted_by?: string;
  /** Enabled field on ai model mapping rule item record. */
  enabled: boolean;
  /** Id field on ai model mapping rule item record. */
  id?: string;
  /** Metadata field on ai model mapping rule item record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai model mapping rule item record. */
  organization_id: string;
  /** Rule id field on ai model mapping rule item record. */
  rule_id: string;
  /** Rule uuid field on ai model mapping rule item record. */
  rule_uuid?: string;
  /** Sort order field on ai model mapping rule item record. */
  sort_order: number;
  /** Source catalog key field on ai model mapping rule item record. */
  source_catalog_key?: string;
  /** Source model field on ai model mapping rule item record. */
  source_model: string;
  /** Status field on ai model mapping rule item record. */
  status: string;
  /** Target catalog key field on ai model mapping rule item record. */
  target_catalog_key?: string;
  /** Target model field on ai model mapping rule item record. */
  target_model: string;
  /** Target provider model field on ai model mapping rule item record. */
  target_provider_model?: string;
  /** Target provider native model field on ai model mapping rule item record. */
  target_provider_native_model?: string;
  /** Tenant id field on ai model mapping rule item record. */
  tenant_id: string;
  /** Updated at field on ai model mapping rule item record. */
  updated_at?: string;
  /** Uuid field on ai model mapping rule item record. */
  uuid: string;
  /** Version field on ai model mapping rule item record. */
  version?: string;
}
