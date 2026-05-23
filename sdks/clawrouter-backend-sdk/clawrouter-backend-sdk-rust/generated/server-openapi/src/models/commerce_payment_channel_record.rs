use serde::{Deserialize, Serialize};

/// Commerce payment channel record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommercePaymentChannelRecord {
    /// Channel no field on commerce payment channel record.
    pub channel_no: String,

    /// Country code field on commerce payment channel record.
    pub country_code: String,

    /// Created at field on commerce payment channel record.
    pub created_at: String,

    /// Currency code field on commerce payment channel record.
    pub currency_code: String,

    /// Method id field on commerce payment channel record.
    pub method_id: String,

    /// Organization id field on commerce payment channel record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Provider account id field on commerce payment channel record.
    pub provider_account_id: String,

    /// Scene code field on commerce payment channel record.
    pub scene_code: String,

    /// Status field on commerce payment channel record.
    pub status: String,

    /// Tenant id field on commerce payment channel record.
    pub tenant_id: String,

    /// Updated at field on commerce payment channel record.
    pub updated_at: String,
}
