/** Commerce payment provider account record schema exposed by Claw Router. */
export interface CommercePaymentProviderAccountRecord {
  /** Account no field on commerce payment provider account record. */
  account_no: string;
  /** Certificate ref field on commerce payment provider account record. */
  certificate_ref?: string;
  /** Country code field on commerce payment provider account record. */
  country_code: string;
  /** Created at field on commerce payment provider account record. */
  created_at: string;
  /** Environment field on commerce payment provider account record. */
  environment: string;
  /** Merchant id field on commerce payment provider account record. */
  merchant_id: string;
  /** Organization id field on commerce payment provider account record. */
  organization_id?: string;
  /** Provider code field on commerce payment provider account record. */
  provider_code: string;
  /** Rotated at field on commerce payment provider account record. */
  rotated_at?: string;
  /** Secret ref field on commerce payment provider account record. */
  secret_ref: string;
  /** Settlement currency field on commerce payment provider account record. */
  settlement_currency: string;
  /** Status field on commerce payment provider account record. */
  status: string;
  /** Tenant id field on commerce payment provider account record. */
  tenant_id: string;
  /** Updated at field on commerce payment provider account record. */
  updated_at: string;
  /** Webhook secret ref field on commerce payment provider account record. */
  webhook_secret_ref?: string;
}
