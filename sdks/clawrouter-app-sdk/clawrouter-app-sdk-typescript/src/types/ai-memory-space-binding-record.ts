import type { JsonValue } from './json-value';

/** Ai memory space binding record schema exposed by Claw Router. */
export interface AiMemorySpaceBindingRecord {
  /** Binding id field on ai memory space binding record. */
  binding_id?: string;
  /** Binding role field on ai memory space binding record. */
  binding_role?: string;
  /** Binding type field on ai memory space binding record. */
  binding_type?: string;
  /** Created at field on ai memory space binding record. */
  created_at?: string;
  /** Data scope field on ai memory space binding record. */
  data_scope?: string;
  /** Deleted at field on ai memory space binding record. */
  deleted_at?: string;
  /** Deleted by field on ai memory space binding record. */
  deleted_by?: string;
  /** Enabled field on ai memory space binding record. */
  enabled?: boolean;
  /** Id field on ai memory space binding record. */
  id?: string;
  /** Memory space id field on ai memory space binding record. */
  memory_space_id?: string;
  /** Metadata field on ai memory space binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai memory space binding record. */
  organization_id?: string;
  /** Priority field on ai memory space binding record. */
  priority?: number;
  /** Status field on ai memory space binding record. */
  status?: string;
  /** Tenant id field on ai memory space binding record. */
  tenant_id?: string;
  /** Updated at field on ai memory space binding record. */
  updated_at?: string;
  /** Uuid field on ai memory space binding record. */
  uuid?: string;
  /** Version field on ai memory space binding record. */
  version?: string;
}
