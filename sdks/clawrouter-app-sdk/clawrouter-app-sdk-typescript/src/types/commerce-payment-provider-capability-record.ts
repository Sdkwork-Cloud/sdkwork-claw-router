import type { JsonValue } from './json-value';

/** Commerce payment provider capability record schema exposed by Claw Router. */
export interface CommercePaymentProviderCapabilityRecord {
  /** Capability code field on commerce payment provider capability record. */
  capability_code: string;
  /** Country code field on commerce payment provider capability record. */
  country_code?: string;
  /** Created at field on commerce payment provider capability record. */
  created_at: string;
  /** Currency code field on commerce payment provider capability record. */
  currency_code?: string;
  /** Effective from field on commerce payment provider capability record. */
  effective_from?: string;
  /** Effective to field on commerce payment provider capability record. */
  effective_to?: string;
  /** Id field on commerce payment provider capability record. */
  id?: string;
  /** Max amount field on commerce payment provider capability record. */
  max_amount?: string;
  /** Metadata json field on commerce payment provider capability record. */
  metadata_json?: Record<string, JsonValue>;
  /** Method code field on commerce payment provider capability record. */
  method_code?: string;
  /** Min amount field on commerce payment provider capability record. */
  min_amount?: string;
  /** Native operation codes field on commerce payment provider capability record. */
  native_operation_codes?: Record<string, JsonValue>;
  /** Organization id field on commerce payment provider capability record. */
  organization_id?: string;
  /** Provider account id field on commerce payment provider capability record. */
  provider_account_id?: string;
  /** Provider code field on commerce payment provider capability record. */
  provider_code: string;
  /** Scene code field on commerce payment provider capability record. */
  scene_code?: string;
  /** Status field on commerce payment provider capability record. */
  status: string;
  /** Supported statement types field on commerce payment provider capability record. */
  supported_statement_types?: Record<string, JsonValue>;
  /** Supported webhook events field on commerce payment provider capability record. */
  supported_webhook_events?: Record<string, JsonValue>;
  /** Tenant id field on commerce payment provider capability record. */
  tenant_id: string;
  /** Updated at field on commerce payment provider capability record. */
  updated_at: string;
}
