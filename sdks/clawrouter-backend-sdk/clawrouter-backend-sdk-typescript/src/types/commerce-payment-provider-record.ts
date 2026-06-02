import type { JsonValue } from './json-value';

/** Commerce payment provider record schema exposed by Claw Router. */
export interface CommercePaymentProviderRecord {
  /** Created at field on commerce payment provider record. */
  created_at: string;
  /** Display name field on commerce payment provider record. */
  display_name: string;
  /** Id field on commerce payment provider record. */
  id?: string;
  /** Organization id field on commerce payment provider record. */
  organization_id?: string;
  /** Provider code field on commerce payment provider record. */
  provider_code: string;
  /** Provider type field on commerce payment provider record. */
  provider_type: string;
  /** Sort order field on commerce payment provider record. */
  sort_order: string;
  /** Status field on commerce payment provider record. */
  status: string;
  /** Supported countries field on commerce payment provider record. */
  supported_countries?: Record<string, JsonValue>;
  /** Supported currencies field on commerce payment provider record. */
  supported_currencies?: Record<string, JsonValue>;
  /** Supported methods field on commerce payment provider record. */
  supported_methods?: Record<string, JsonValue>;
  /** Tenant id field on commerce payment provider record. */
  tenant_id: string;
  /** Updated at field on commerce payment provider record. */
  updated_at: string;
}
