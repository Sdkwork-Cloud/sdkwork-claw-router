import type { JsonValue } from './json-value';

/** Messaging route rule target record schema exposed by Claw Router. */
export interface MessagingRouteRuleTargetRecord {
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
  /** Sender identity id field on messaging route rule target record. */
  sender_identity_id?: string;
  /** Status field on messaging route rule target record. */
  status?: string;
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
}
