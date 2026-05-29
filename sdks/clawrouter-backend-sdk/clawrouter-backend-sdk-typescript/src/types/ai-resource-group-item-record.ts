import type { JsonValue } from './json-value';

/** Ai resource group item record schema exposed by Claw Router. */
export interface AiResourceGroupItemRecord {
  /** Child resource group code field on ai resource group item record. */
  child_resource_group_code?: string;
  /** Child resource group id field on ai resource group item record. */
  child_resource_group_id?: string;
  /** Created at field on ai resource group item record. */
  created_at?: string;
  /** Data scope field on ai resource group item record. */
  data_scope?: string;
  /** Deleted at field on ai resource group item record. */
  deleted_at?: string;
  /** Deleted by field on ai resource group item record. */
  deleted_by?: string;
  /** Id field on ai resource group item record. */
  id?: string;
  /** Item role field on ai resource group item record. */
  item_role?: string;
  /** Item type field on ai resource group item record. */
  item_type: string;
  /** Metadata field on ai resource group item record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai resource group item record. */
  organization_id: string;
  /** Resource code field on ai resource group item record. */
  resource_code?: string;
  /** Resource group code field on ai resource group item record. */
  resource_group_code?: string;
  /** Resource group id field on ai resource group item record. */
  resource_group_id: string;
  /** Resource id field on ai resource group item record. */
  resource_id?: string;
  /** Sort order field on ai resource group item record. */
  sort_order?: number;
  /** Status field on ai resource group item record. */
  status: string;
  /** Tenant id field on ai resource group item record. */
  tenant_id: string;
  /** Updated at field on ai resource group item record. */
  updated_at?: string;
  /** Uuid field on ai resource group item record. */
  uuid: string;
  /** Version field on ai resource group item record. */
  version?: string;
}
