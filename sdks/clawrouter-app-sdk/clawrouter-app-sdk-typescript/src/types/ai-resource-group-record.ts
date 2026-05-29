import type { JsonValue } from './json-value';

/** Ai resource group record schema exposed by Claw Router. */
export interface AiResourceGroupRecord {
  /** Created at field on ai resource group record. */
  created_at?: string;
  /** Data scope field on ai resource group record. */
  data_scope?: string;
  /** Deleted at field on ai resource group record. */
  deleted_at?: string;
  /** Deleted by field on ai resource group record. */
  deleted_by?: string;
  /** Description field on ai resource group record. */
  description?: string;
  /** Group code field on ai resource group record. */
  group_code: string;
  /** Group name field on ai resource group record. */
  group_name: string;
  /** Group type field on ai resource group record. */
  group_type?: string;
  /** Id field on ai resource group record. */
  id?: string;
  /** Metadata field on ai resource group record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai resource group record. */
  organization_id: string;
  /** Selection mode field on ai resource group record. */
  selection_mode?: string;
  /** Sort order field on ai resource group record. */
  sort_order?: number;
  /** Status field on ai resource group record. */
  status: string;
  /** Tenant id field on ai resource group record. */
  tenant_id: string;
  /** Updated at field on ai resource group record. */
  updated_at?: string;
  /** Uuid field on ai resource group record. */
  uuid: string;
  /** Version field on ai resource group record. */
  version?: string;
}
