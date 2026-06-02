import type { JsonValue } from './json-value';

/** Messaging route rule record schema exposed by Claw Router. */
export interface MessagingRouteRuleRecord {
  /** App id field on messaging route rule record. */
  app_id?: string;
  /** Channel field on messaging route rule record. */
  channel?: string;
  /** Country code field on messaging route rule record. */
  country_code?: string;
  /** Created at field on messaging route rule record. */
  created_at?: string;
  /** Data scope field on messaging route rule record. */
  data_scope?: string;
  /** Deleted at field on messaging route rule record. */
  deleted_at?: string;
  /** Deleted by field on messaging route rule record. */
  deleted_by?: string;
  /** Delivery purpose field on messaging route rule record. */
  delivery_purpose?: string;
  /** Effective from field on messaging route rule record. */
  effective_from?: string;
  /** Effective to field on messaging route rule record. */
  effective_to?: string;
  /** Failover policy field on messaging route rule record. */
  failover_policy?: Record<string, JsonValue>;
  /** Id field on messaging route rule record. */
  id?: string;
  /** Locale field on messaging route rule record. */
  locale?: string;
  /** Metadata field on messaging route rule record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging route rule record. */
  organization_id?: string;
  /** Priority field on messaging route rule record. */
  priority?: number;
  /** Rule code field on messaging route rule record. */
  rule_code?: string;
  /** Scene code field on messaging route rule record. */
  scene_code?: string;
  /** Selection policy field on messaging route rule record. */
  selection_policy?: Record<string, JsonValue>;
  /** Status field on messaging route rule record. */
  status?: string;
  /** Tenant id field on messaging route rule record. */
  tenant_id?: string;
  /** Updated at field on messaging route rule record. */
  updated_at?: string;
  /** User segment field on messaging route rule record. */
  user_segment?: string;
  /** Uuid field on messaging route rule record. */
  uuid?: string;
  /** Version field on messaging route rule record. */
  version?: string;
  /** Weight field on messaging route rule record. */
  weight?: number;
}
