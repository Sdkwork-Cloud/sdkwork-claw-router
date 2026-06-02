import type { JsonValue } from './json-value';

/** Messaging provider capability record schema exposed by Claw Router. */
export interface MessagingProviderCapabilityRecord {
  /** Capability schema field on messaging provider capability record. */
  capability_schema?: Record<string, JsonValue>;
  /** Channel field on messaging provider capability record. */
  channel?: string;
  /** Country code field on messaging provider capability record. */
  country_code?: string;
  /** Created at field on messaging provider capability record. */
  created_at?: string;
  /** Data scope field on messaging provider capability record. */
  data_scope?: string;
  /** Deleted at field on messaging provider capability record. */
  deleted_at?: string;
  /** Deleted by field on messaging provider capability record. */
  deleted_by?: string;
  /** Delivery purpose field on messaging provider capability record. */
  delivery_purpose?: string;
  /** Health status field on messaging provider capability record. */
  health_status?: string;
  /** Id field on messaging provider capability record. */
  id?: string;
  /** Last verified at field on messaging provider capability record. */
  last_verified_at?: string;
  /** Locale field on messaging provider capability record. */
  locale?: string;
  /** Metadata field on messaging provider capability record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on messaging provider capability record. */
  organization_id?: string;
  /** Provider account id field on messaging provider capability record. */
  provider_account_id?: string;
  /** Provider code field on messaging provider capability record. */
  provider_code?: string;
  /** Rate limit policy field on messaging provider capability record. */
  rate_limit_policy?: Record<string, JsonValue>;
  /** Sandbox supported field on messaging provider capability record. */
  sandbox_supported?: boolean;
  /** Status field on messaging provider capability record. */
  status?: string;
  /** Supports batch send field on messaging provider capability record. */
  supports_batch_send?: boolean;
  /** Supports delivery receipt field on messaging provider capability record. */
  supports_delivery_receipt?: boolean;
  /** Supports template sync field on messaging provider capability record. */
  supports_template_sync?: boolean;
  /** Supports test send field on messaging provider capability record. */
  supports_test_send?: boolean;
  /** Supports webhook field on messaging provider capability record. */
  supports_webhook?: boolean;
  /** Tenant id field on messaging provider capability record. */
  tenant_id?: string;
  /** Updated at field on messaging provider capability record. */
  updated_at?: string;
  /** Uuid field on messaging provider capability record. */
  uuid?: string;
  /** Version field on messaging provider capability record. */
  version?: string;
}
