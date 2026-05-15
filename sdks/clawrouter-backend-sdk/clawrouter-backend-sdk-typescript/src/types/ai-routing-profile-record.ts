import type { JsonValue } from './json-value';

/** Ai routing profile record schema exposed by Claw Router. */
export interface AiRoutingProfileRecord {
  /** Config hash field on ai routing profile record. */
  config_hash?: string;
  /** Created at field on ai routing profile record. */
  created_at?: string;
  /** Data scope field on ai routing profile record. */
  data_scope?: string;
  /** Deleted at field on ai routing profile record. */
  deleted_at?: string;
  /** Deleted by field on ai routing profile record. */
  deleted_by?: string;
  /** Id field on ai routing profile record. */
  id?: string;
  /** Metadata field on ai routing profile record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai routing profile record. */
  organization_id?: string;
  /** Policy id field on ai routing profile record. */
  policy_id?: string;
  /** Profile name field on ai routing profile record. */
  profile_name?: string;
  /** Profile version field on ai routing profile record. */
  profile_version?: string;
  /** Published at field on ai routing profile record. */
  published_at?: string;
  /** Published by field on ai routing profile record. */
  published_by?: string;
  /** Release status field on ai routing profile record. */
  release_status?: string;
  /** Rollback from profile id field on ai routing profile record. */
  rollback_from_profile_id?: string;
  /** Status field on ai routing profile record. */
  status?: string;
  /** Tenant id field on ai routing profile record. */
  tenant_id?: string;
  /** Traffic percent field on ai routing profile record. */
  traffic_percent?: string;
  /** Updated at field on ai routing profile record. */
  updated_at?: string;
  /** Uuid field on ai routing profile record. */
  uuid?: string;
  /** Version field on ai routing profile record. */
  version?: string;
}
