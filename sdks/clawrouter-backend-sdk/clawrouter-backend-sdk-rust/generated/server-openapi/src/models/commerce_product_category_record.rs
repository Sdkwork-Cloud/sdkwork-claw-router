use serde::{Deserialize, Serialize};

/// Commerce product category record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryRecord {
    /// Category no field on commerce product category record.
    pub category_no: String,

    /// Created at field on commerce product category record.
    pub created_at: String,

    /// Description field on commerce product category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Icon url field on commerce product category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub icon_url: Option<String>,

    /// Level no field on commerce product category record.
    pub level_no: i64,

    /// Name field on commerce product category record.
    pub name: String,

    /// Organization id field on commerce product category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Parent id field on commerce product category record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on commerce product category record.
    pub path: String,

    /// Status field on commerce product category record.
    pub status: String,

    /// Tenant id field on commerce product category record.
    pub tenant_id: String,

    /// Updated at field on commerce product category record.
    pub updated_at: String,
}
