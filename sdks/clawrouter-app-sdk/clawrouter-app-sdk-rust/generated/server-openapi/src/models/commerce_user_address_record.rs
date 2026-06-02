use serde::{Deserialize, Serialize};

/// Commerce user address record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceUserAddressRecord {
    /// Address line 1 encrypted field on commerce user address record.
    pub address_line1_encrypted: String,

    /// Address line 2 encrypted field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub address_line2_encrypted: Option<String>,

    /// City field on commerce user address record.
    pub city: String,

    /// Country code field on commerce user address record.
    pub country_code: String,

    /// Created at field on commerce user address record.
    pub created_at: String,

    /// District field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub district: Option<String>,

    /// Id field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Is default field on commerce user address record.
    pub is_default: bool,

    /// Organization id field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce user address record.
    pub owner_user_id: String,

    /// Phone country code field on commerce user address record.
    pub phone_country_code: String,

    /// Phone masked field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub phone_masked: Option<String>,

    /// Phone number encrypted field on commerce user address record.
    pub phone_number_encrypted: String,

    /// Postal code field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub postal_code: Option<String>,

    /// Recipient name field on commerce user address record.
    pub recipient_name: String,

    /// Region code field on commerce user address record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Status field on commerce user address record.
    pub status: String,

    /// Tenant id field on commerce user address record.
    pub tenant_id: String,

    /// Updated at field on commerce user address record.
    pub updated_at: String,
}
