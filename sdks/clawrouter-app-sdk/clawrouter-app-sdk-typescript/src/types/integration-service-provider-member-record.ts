import type { JsonValue } from './json-value';

/** Integration service provider member record schema exposed by Claw Router. */
export interface IntegrationServiceProviderMemberRecord {
  /** Created at field on integration service provider member record. */
  created_at?: string;
  /** Data scope field on integration service provider member record. */
  data_scope?: string;
  /** Deleted at field on integration service provider member record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider member record. */
  deleted_by?: string;
  /** Effective from field on integration service provider member record. */
  effective_from?: string;
  /** Effective to field on integration service provider member record. */
  effective_to?: string;
  /** Id field on integration service provider member record. */
  id?: string;
  /** Member user id field on integration service provider member record. */
  member_user_id?: string;
  /** Metadata field on integration service provider member record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider member record. */
  organization_id?: string;
  /** Permission policy id field on integration service provider member record. */
  permission_policy_id?: string;
  /** Role code field on integration service provider member record. */
  role_code?: string;
  /** Service provider id field on integration service provider member record. */
  service_provider_id?: string;
  /** Status field on integration service provider member record. */
  status?: string;
  /** Tenant id field on integration service provider member record. */
  tenant_id?: string;
  /** Updated at field on integration service provider member record. */
  updated_at?: string;
  /** Uuid field on integration service provider member record. */
  uuid?: string;
  /** Version field on integration service provider member record. */
  version?: string;
}
