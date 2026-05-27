import type { JsonValue } from './json-value';

/** Messaging route rule record schema exposed by Claw Router. */
export interface MessagingRouteRuleRecord {
  /** App id field on messaging route rule record. */
  app_id?: string;
  /** Created at field on messaging route rule record. */
  created_at?: string;
  /** Data scope field on messaging route rule record. */
  data_scope?: string;
  /** Deleted at field on messaging route rule record. */
  deleted_at?: string;
  /** Deleted by field on messaging route rule record. */
  deleted_by?: string;
  /** Effective from field on messaging route rule record. */
  effective_from?: string;
  /** Effective to field on messaging route rule record. */
  effective_to?: string;
  /** Id field on messaging route rule record. */
  id?: string;
  /** Metadata field on messaging route rule record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging route rule record. */
  organization_id?: string;
  /** Status field on messaging route rule record. */
  status?: string;
  /** Tenant id field on messaging route rule record. */
  tenant_id?: string;
  /** Updated at field on messaging route rule record. */
  updated_at?: string;
  /** Uuid field on messaging route rule record. */
  uuid?: string;
  /** Version field on messaging route rule record. */
  version?: string;
}
