/** Commerce payment channel record schema exposed by Claw Router. */
export interface CommercePaymentChannelRecord {
  /** Channel no field on commerce payment channel record. */
  channel_no: string;
  /** Country code field on commerce payment channel record. */
  country_code: string;
  /** Created at field on commerce payment channel record. */
  created_at: string;
  /** Currency code field on commerce payment channel record. */
  currency_code: string;
  /** Method id field on commerce payment channel record. */
  method_id: string;
  /** Organization id field on commerce payment channel record. */
  organization_id?: string;
  /** Provider account id field on commerce payment channel record. */
  provider_account_id: string;
  /** Scene code field on commerce payment channel record. */
  scene_code: string;
  /** Status field on commerce payment channel record. */
  status: string;
  /** Tenant id field on commerce payment channel record. */
  tenant_id: string;
  /** Updated at field on commerce payment channel record. */
  updated_at: string;
}
