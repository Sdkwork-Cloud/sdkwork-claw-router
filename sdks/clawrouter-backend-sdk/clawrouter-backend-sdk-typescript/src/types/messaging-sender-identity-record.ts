import type { JsonValue } from './json-value';

/** Messaging sender identity record schema exposed by Claw Router. */
export interface MessagingSenderIdentityRecord {
  /** Country code field on messaging sender identity record. */
  country_code?: string;
  /** Created at field on messaging sender identity record. */
  created_at?: string;
  /** Data scope field on messaging sender identity record. */
  data_scope?: string;
  /** Deleted at field on messaging sender identity record. */
  deleted_at?: string;
  /** Deleted by field on messaging sender identity record. */
  deleted_by?: string;
  /** Display name field on messaging sender identity record. */
  display_name?: string;
  /** Domain name field on messaging sender identity record. */
  domain_name?: string;
  /** From email field on messaging sender identity record. */
  from_email?: string;
  /** From name field on messaging sender identity record. */
  from_name?: string;
  /** Id field on messaging sender identity record. */
  id?: string;
  /** Metadata field on messaging sender identity record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging sender identity record. */
  organization_id?: string;
  /** Rejection reason field on messaging sender identity record. */
  rejection_reason?: string;
  /** Reply to field on messaging sender identity record. */
  reply_to?: string;
  /** Sender id field on messaging sender identity record. */
  sender_id?: string;
  /** Sign name field on messaging sender identity record. */
  sign_name?: string;
  /** Status field on messaging sender identity record. */
  status?: string;
  /** Tenant id field on messaging sender identity record. */
  tenant_id?: string;
  /** Updated at field on messaging sender identity record. */
  updated_at?: string;
  /** Uuid field on messaging sender identity record. */
  uuid?: string;
  /** Verified at field on messaging sender identity record. */
  verified_at?: string;
  /** Version field on messaging sender identity record. */
  version?: string;
}
