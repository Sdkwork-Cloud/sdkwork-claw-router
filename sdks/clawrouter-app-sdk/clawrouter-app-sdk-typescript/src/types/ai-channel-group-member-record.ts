import type { JsonValue } from './json-value';

/** Ai channel group member record schema exposed by Claw Router. */
export interface AiChannelGroupMemberRecord {
  /** Channel group id field on ai channel group member record. */
  channel_group_id: string;
  /** Channel id field on ai channel group member record. */
  channel_id: string;
  /** Created at field on ai channel group member record. */
  created_at?: string;
  /** Data scope field on ai channel group member record. */
  data_scope?: string;
  /** Deleted at field on ai channel group member record. */
  deleted_at?: string;
  /** Deleted by field on ai channel group member record. */
  deleted_by?: string;
  /** Effective from field on ai channel group member record. */
  effective_from?: string;
  /** Effective to field on ai channel group member record. */
  effective_to?: string;
  /** Id field on ai channel group member record. */
  id?: string;
  /** Metadata field on ai channel group member record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai channel group member record. */
  organization_id: string;
  /** Status field on ai channel group member record. */
  status: string;
  /** Tenant id field on ai channel group member record. */
  tenant_id: string;
  /** Updated at field on ai channel group member record. */
  updated_at?: string;
  /** Uuid field on ai channel group member record. */
  uuid: string;
  /** Version field on ai channel group member record. */
  version?: string;
}
