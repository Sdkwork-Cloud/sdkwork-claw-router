import type { JsonValue } from './json-value';

/** Messaging route rule target record schema exposed by Claw Router. */
export interface MessagingRouteRuleTargetRecord {
  /** Circuit breaker policy field on messaging route rule target record. */
  circuit_breaker_policy?: Record<string, JsonValue>;
  /** Created at field on messaging route rule target record. */
  created_at?: string;
  /** Data scope field on messaging route rule target record. */
  data_scope?: string;
  /** Deleted at field on messaging route rule target record. */
  deleted_at?: string;
  /** Deleted by field on messaging route rule target record. */
  deleted_by?: string;
  /** Id field on messaging route rule target record. */
  id?: string;
  /** Metadata field on messaging route rule target record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging route rule target record. */
  organization_id?: string;
  /** Provider account id field on messaging route rule target record. */
  provider_account_id?: string;
  /** Provider code field on messaging route rule target record. */
  provider_code?: string;
  /** Route rule id field on messaging route rule target record. */
  route_rule_id?: string;
  /** Sender identity id field on messaging route rule target record. */
  sender_identity_id?: string;
  /** Status field on messaging route rule target record. */
  status?: string;
  /** Target order field on messaging route rule target record. */
  target_order?: number;
  /** Template binding id field on messaging route rule target record. */
  template_binding_id?: string;
  /** Tenant id field on messaging route rule target record. */
  tenant_id?: string;
  /** Updated at field on messaging route rule target record. */
  updated_at?: string;
  /** Uuid field on messaging route rule target record. */
  uuid?: string;
  /** Version field on messaging route rule target record. */
  version?: string;
  /** Weight field on messaging route rule target record. */
  weight?: number;
}
