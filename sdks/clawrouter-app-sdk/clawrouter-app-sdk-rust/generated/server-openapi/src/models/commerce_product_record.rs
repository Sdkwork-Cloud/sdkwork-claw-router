use serde::{Deserialize, Serialize};

/// Commerce product record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductRecord {
    /// Category id field on commerce product record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub category_id: Option<String>,

    /// Created at field on commerce product record.
    pub created_at: String,

    /// Description field on commerce product record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Organization id field on commerce product record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Product no field on commerce product record.
    pub product_no: String,

    /// Status field on commerce product record.
    pub status: String,

    /// Subtitle field on commerce product record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub subtitle: Option<String>,

    /// Tenant id field on commerce product record.
    pub tenant_id: String,

    /// Title field on commerce product record.
    pub title: String,

    /// Updated at field on commerce product record.
    pub updated_at: String,
}
