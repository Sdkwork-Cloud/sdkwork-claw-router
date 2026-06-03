use serde::{Deserialize, Serialize};

/// Commerce product category attribute mutation request schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryAttributeMutationRequest {
    /// Attribute id field on commerce product category attribute mutation request.
    #[serde(rename = "attributeId")]
    pub attribute_id: String,

    /// Category id field on commerce product category attribute mutation request.
    #[serde(rename = "categoryId")]
    pub category_id: String,

    /// Filterable field on commerce product category attribute mutation request.
    pub filterable: bool,

    /// Required field on commerce product category attribute mutation request.
    pub required: bool,

    /// Searchable field on commerce product category attribute mutation request.
    pub searchable: bool,

    /// Sort order field on commerce product category attribute mutation request.
    #[serde(rename = "sortOrder")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub sort_order: Option<i64>,

    /// Status field on commerce product category attribute mutation request.
    pub status: String,
}
