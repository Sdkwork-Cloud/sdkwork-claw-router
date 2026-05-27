use serde::{Deserialize, Serialize};

/// Commerce product category item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryItem {
    /// Category no field on commerce product category item.
    #[serde(rename = "categoryNo")]
    pub category_no: String,

    /// Created at field on commerce product category item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Id field on commerce product category item.
    pub id: String,

    /// Level no field on commerce product category item.
    #[serde(rename = "levelNo")]
    pub level_no: i64,

    /// Name field on commerce product category item.
    pub name: String,

    /// Parent id field on commerce product category item.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Path field on commerce product category item.
    pub path: String,

    /// Sort order field on commerce product category item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on commerce product category item.
    pub status: String,

    /// Updated at field on commerce product category item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,
}
