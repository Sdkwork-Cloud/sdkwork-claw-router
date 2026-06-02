/** Commerce user address record schema exposed by Claw Router. */
export interface CommerceUserAddressRecord {
  /** Address line 1 encrypted field on commerce user address record. */
  address_line1_encrypted: string;
  /** Address line 2 encrypted field on commerce user address record. */
  address_line2_encrypted?: string;
  /** City field on commerce user address record. */
  city: string;
  /** Country code field on commerce user address record. */
  country_code: string;
  /** Created at field on commerce user address record. */
  created_at: string;
  /** District field on commerce user address record. */
  district?: string;
  /** Id field on commerce user address record. */
  id?: string;
  /** Is default field on commerce user address record. */
  is_default: boolean;
  /** Organization id field on commerce user address record. */
  organization_id?: string;
  /** Owner user id field on commerce user address record. */
  owner_user_id: string;
  /** Phone country code field on commerce user address record. */
  phone_country_code: string;
  /** Phone masked field on commerce user address record. */
  phone_masked?: string;
  /** Phone number encrypted field on commerce user address record. */
  phone_number_encrypted: string;
  /** Postal code field on commerce user address record. */
  postal_code?: string;
  /** Recipient name field on commerce user address record. */
  recipient_name: string;
  /** Region code field on commerce user address record. */
  region_code?: string;
  /** Status field on commerce user address record. */
  status: string;
  /** Tenant id field on commerce user address record. */
  tenant_id: string;
  /** Updated at field on commerce user address record. */
  updated_at: string;
}
