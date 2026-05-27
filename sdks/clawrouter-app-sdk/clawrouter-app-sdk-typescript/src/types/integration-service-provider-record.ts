import type { JsonValue } from './json-value';

/** Integration service provider record schema exposed by Claw Router. */
export interface IntegrationServiceProviderRecord {
  /** Activated at field on integration service provider record. */
  activated_at?: string;
  /** Created at field on integration service provider record. */
  created_at?: string;
  /** Data scope field on integration service provider record. */
  data_scope?: string;
  /** Default currency field on integration service provider record. */
  default_currency?: string;
  /** Default timezone field on integration service provider record. */
  default_timezone?: string;
  /** Deleted at field on integration service provider record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider record. */
  deleted_by?: string;
  /** Display name field on integration service provider record. */
  display_name?: string;
  /** Id field on integration service provider record. */
  id?: string;
  /** Metadata field on integration service provider record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider record. */
  organization_id?: string;
  /** Owner organization id field on integration service provider record. */
  owner_organization_id?: string;
  /** Owner tenant id field on integration service provider record. */
  owner_tenant_id?: string;
  /** Owner user id field on integration service provider record. */
  owner_user_id?: string;
  /** Provider no field on integration service provider record. */
  provider_no?: string;
  /** Provider type field on integration service provider record. */
  provider_type?: string;
  /** Risk level field on integration service provider record. */
  risk_level?: string;
  /** Status field on integration service provider record. */
  status?: string;
  /** Suspended at field on integration service provider record. */
  suspended_at?: string;
  /** Suspended reason code field on integration service provider record. */
  suspended_reason_code?: string;
  /** Tenant id field on integration service provider record. */
  tenant_id?: string;
  /** Updated at field on integration service provider record. */
  updated_at?: string;
  /** Uuid field on integration service provider record. */
  uuid?: string;
  /** Version field on integration service provider record. */
  version?: string;
}
