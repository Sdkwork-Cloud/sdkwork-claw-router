use serde::{Deserialize, Serialize};

/// Commerce product category mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryMutationRequest {
    /// Category no field on commerce product category mutation request.
    #[serde(rename = "categoryNo")]
    pub category_no: String,

    /// Name field on commerce product category mutation request.
    pub name: String,

    /// Parent id field on commerce product category mutation request.
    #[serde(rename = "parentId")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent_id: Option<String>,

    /// Sort order field on commerce product category mutation request.
    #[serde(rename = "sortOrder")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on commerce product category mutation request.
    pub status: String,
}
