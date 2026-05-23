use serde::{Deserialize, Serialize};

/// Commerce invoice title record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceInvoiceTitleRecord {
    /// Created at field on commerce invoice title record.
    pub created_at: String,

    /// Name field on commerce invoice title record.
    pub name: String,

    /// Owner user id field on commerce invoice title record.
    pub owner_user_id: String,

    /// Tax no field on commerce invoice title record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tax_no: Option<String>,

    /// Tenant id field on commerce invoice title record.
    pub tenant_id: String,

    /// Title type field on commerce invoice title record.
    pub title_type: String,

    /// Updated at field on commerce invoice title record.
    pub updated_at: String,
}
