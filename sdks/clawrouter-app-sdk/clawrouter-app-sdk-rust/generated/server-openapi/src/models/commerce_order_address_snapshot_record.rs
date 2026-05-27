use serde::{Deserialize, Serialize};

/// Commerce order address snapshot record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceOrderAddressSnapshotRecord {
    /// Address line 1 encrypted field on commerce order address snapshot record.
    pub address_line1_encrypted: String,

    /// Captured at field on commerce order address snapshot record.
    pub captured_at: String,

    /// City field on commerce order address snapshot record.
    pub city: String,

    /// Country code field on commerce order address snapshot record.
    pub country_code: String,

    /// District field on commerce order address snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub district: Option<String>,

    /// Order id field on commerce order address snapshot record.
    pub order_id: String,

    /// Organization id field on commerce order address snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Phone masked field on commerce order address snapshot record.
    pub phone_masked: String,

    /// Postal code field on commerce order address snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub postal_code: Option<String>,

    /// Recipient name snapshot field on commerce order address snapshot record.
    pub recipient_name_snapshot: String,

    /// Region code field on commerce order address snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub region_code: Option<String>,

    /// Source address id field on commerce order address snapshot record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub source_address_id: Option<String>,

    /// Tenant id field on commerce order address snapshot record.
    pub tenant_id: String,
}
