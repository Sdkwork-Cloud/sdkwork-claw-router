use serde::{Deserialize, Serialize};

/// Commerce cart record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceCartRecord {
    /// Cart no field on commerce cart record.
    pub cart_no: String,

    /// Created at field on commerce cart record.
    pub created_at: String,

    /// Currency code field on commerce cart record.
    pub currency_code: String,

    /// Id field on commerce cart record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce cart record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Owner user id field on commerce cart record.
    pub owner_user_id: String,

    /// Status field on commerce cart record.
    pub status: String,

    /// Tenant id field on commerce cart record.
    pub tenant_id: String,

    /// Updated at field on commerce cart record.
    pub updated_at: String,

    /// Version field on commerce cart record.
    pub version: String,
}
