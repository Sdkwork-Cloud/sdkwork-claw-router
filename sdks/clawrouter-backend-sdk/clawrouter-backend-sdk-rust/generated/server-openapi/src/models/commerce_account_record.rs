use serde::{Deserialize, Serialize};

/// Commerce account record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceAccountRecord {
    /// Asset type field on commerce account record.
    pub asset_type: String,

    /// Created at field on commerce account record.
    pub created_at: String,

    /// Currency code field on commerce account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub currency_code: Option<String>,

    /// Organization id field on commerce account record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce account record.
    pub owner_user_id: String,

    /// Status field on commerce account record.
    pub status: String,

    /// Tenant id field on commerce account record.
    pub tenant_id: String,

    /// Updated at field on commerce account record.
    pub updated_at: String,
}
