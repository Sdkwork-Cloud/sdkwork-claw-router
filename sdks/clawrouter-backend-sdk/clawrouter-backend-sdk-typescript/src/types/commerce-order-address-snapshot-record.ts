/** Commerce order address snapshot record schema exposed by Claw Router. */
export interface CommerceOrderAddressSnapshotRecord {
  /** Address line 1 encrypted field on commerce order address snapshot record. */
  address_line1_encrypted: string;
  /** Captured at field on commerce order address snapshot record. */
  captured_at: string;
  /** City field on commerce order address snapshot record. */
  city: string;
  /** Country code field on commerce order address snapshot record. */
  country_code: string;
  /** District field on commerce order address snapshot record. */
  district?: string;
  /** Order id field on commerce order address snapshot record. */
  order_id: string;
  /** Organization id field on commerce order address snapshot record. */
  organization_id?: string;
  /** Phone masked field on commerce order address snapshot record. */
  phone_masked: string;
  /** Postal code field on commerce order address snapshot record. */
  postal_code?: string;
  /** Recipient name snapshot field on commerce order address snapshot record. */
  recipient_name_snapshot: string;
  /** Region code field on commerce order address snapshot record. */
  region_code?: string;
  /** Source address id field on commerce order address snapshot record. */
  source_address_id?: string;
  /** Tenant id field on commerce order address snapshot record. */
  tenant_id: string;
}
