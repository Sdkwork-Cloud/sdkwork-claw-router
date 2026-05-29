import type { JsonValue } from './json-value';

/** Ai channel resource record schema exposed by Claw Router. */
export interface AiChannelResourceRecord {
  /** Channel code field on ai channel resource record. */
  channel_code?: string;
  /** Channel id field on ai channel resource record. */
  channel_id: string;
  /** Created at field on ai channel resource record. */
  created_at?: string;
  /** Data scope field on ai channel resource record. */
  data_scope?: string;
  /** Deleted at field on ai channel resource record. */
  deleted_at?: string;
  /** Deleted by field on ai channel resource record. */
  deleted_by?: string;
  /** Effective from field on ai channel resource record. */
  effective_from?: string;
  /** Effective to field on ai channel resource record. */
  effective_to?: string;
  /** Id field on ai channel resource record. */
  id?: string;
  /** Metadata field on ai channel resource record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai channel resource record. */
  organization_id: string;
  /** Provider code field on ai channel resource record. */
  provider_code?: string;
  /** Resource code field on ai channel resource record. */
  resource_code?: string;
  /** Resource group code field on ai channel resource record. */
  resource_group_code?: string;
  /** Resource group id field on ai channel resource record. */
  resource_group_id?: string;
  /** Resource id field on ai channel resource record. */
  resource_id?: string;
  /** Status field on ai channel resource record. */
  status: string;
  /** Tenant id field on ai channel resource record. */
  tenant_id: string;
  /** Updated at field on ai channel resource record. */
  updated_at?: string;
  /** Uuid field on ai channel resource record. */
  uuid: string;
  /** Version field on ai channel resource record. */
  version?: string;
}
