import type { JsonValue } from './json-value';

/** Ai config version record schema exposed by Claw Router. */
export interface AiConfigVersionRecord {
  /** Changed object id field on ai config version record. */
  changed_object_id?: string;
  /** Changed object type field on ai config version record. */
  changed_object_type?: string;
  /** Config scope field on ai config version record. */
  config_scope: string;
  /** Created at field on ai config version record. */
  created_at?: string;
  /** Data scope field on ai config version record. */
  data_scope?: string;
  /** Deleted at field on ai config version record. */
  deleted_at?: string;
  /** Deleted by field on ai config version record. */
  deleted_by?: string;
  /** Id field on ai config version record. */
  id?: string;
  /** Metadata field on ai config version record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai config version record. */
  organization_id: string;
  /** Published at field on ai config version record. */
  published_at?: string;
  /** Status field on ai config version record. */
  status: string;
  /** Tenant id field on ai config version record. */
  tenant_id: string;
  /** Updated at field on ai config version record. */
  updated_at?: string;
  /** Uuid field on ai config version record. */
  uuid: string;
  /** Version field on ai config version record. */
  version?: string;
}
