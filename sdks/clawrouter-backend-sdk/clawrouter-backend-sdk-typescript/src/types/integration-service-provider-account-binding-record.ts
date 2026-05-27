import type { JsonValue } from './json-value';

/** Integration service provider account binding record schema exposed by Claw Router. */
export interface IntegrationServiceProviderAccountBindingRecord {
  /** Account role field on integration service provider account binding record. */
  account_role?: string;
  /** Asset type field on integration service provider account binding record. */
  asset_type?: string;
  /** Commerce account id field on integration service provider account binding record. */
  commerce_account_id?: string;
  /** Created at field on integration service provider account binding record. */
  created_at?: string;
  /** Currency field on integration service provider account binding record. */
  currency?: string;
  /** Data scope field on integration service provider account binding record. */
  data_scope?: string;
  /** Deleted at field on integration service provider account binding record. */
  deleted_at?: string;
  /** Deleted by field on integration service provider account binding record. */
  deleted_by?: string;
  /** Id field on integration service provider account binding record. */
  id?: string;
  /** Metadata field on integration service provider account binding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on integration service provider account binding record. */
  organization_id?: string;
  /** Service provider id field on integration service provider account binding record. */
  service_provider_id?: string;
  /** Status field on integration service provider account binding record. */
  status?: string;
  /** Tenant id field on integration service provider account binding record. */
  tenant_id?: string;
  /** Updated at field on integration service provider account binding record. */
  updated_at?: string;
  /** Uuid field on integration service provider account binding record. */
  uuid?: string;
  /** Version field on integration service provider account binding record. */
  version?: string;
}
