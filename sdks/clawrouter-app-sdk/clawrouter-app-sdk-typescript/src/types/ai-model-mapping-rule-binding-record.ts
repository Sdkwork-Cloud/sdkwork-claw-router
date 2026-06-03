import type { JsonValue } from './json-value';

/** Ai model mapping rule binding record schema exposed by Claw Router. */
export interface AiModelMappingRuleBindingRecord {
  /** Binding code field on ai model mapping rule binding record. */
  binding_code?: string;
  /** Binding id field on ai model mapping rule binding record. */
  binding_id?: string;
  /** Binding name snapshot field on ai model mapping rule binding record. */
  binding_name_snapshot?: string;
  /** Binding type field on ai model mapping rule binding record. */
  binding_type: string;
  /** Created at field on ai model mapping rule binding record. */
  created_at?: string;
  /** Data scope field on ai model mapping rule binding record. */
  data_scope?: string;
  /** Deleted at field on ai model mapping rule binding record. */
  deleted_at?: string;
  /** Deleted by field on ai model mapping rule binding record. */
  deleted_by?: string;
  /** Enabled field on ai model mapping rule binding record. */
  enabled: boolean;
  /** Id field on ai model mapping rule binding record. */
  id?: string;
  /** Metadata field on ai model mapping rule binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai model mapping rule binding record. */
  organization_id: string;
  /** Rule id field on ai model mapping rule binding record. */
  rule_id: string;
  /** Rule uuid field on ai model mapping rule binding record. */
  rule_uuid?: string;
  /** Sort order field on ai model mapping rule binding record. */
  sort_order: number;
  /** Status field on ai model mapping rule binding record. */
  status: string;
  /** Tenant id field on ai model mapping rule binding record. */
  tenant_id: string;
  /** Updated at field on ai model mapping rule binding record. */
  updated_at?: string;
  /** Uuid field on ai model mapping rule binding record. */
  uuid: string;
  /** Version field on ai model mapping rule binding record. */
  version?: string;
}
