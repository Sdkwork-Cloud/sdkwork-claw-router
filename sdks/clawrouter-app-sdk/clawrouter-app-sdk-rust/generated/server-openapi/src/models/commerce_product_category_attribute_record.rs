use serde::{Deserialize, Serialize};

/// Commerce product category attribute record schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryAttributeRecord {
    /// Attribute id field on commerce product category attribute record.
    pub attribute_id: String,

    /// Category id field on commerce product category attribute record.
    pub category_id: String,

    /// Created at field on commerce product category attribute record.
    pub created_at: String,

    /// Filterable field on commerce product category attribute record.
    pub filterable: bool,

    /// Id field on commerce product category attribute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,

    /// Organization id field on commerce product category attribute record.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub organization_id: Option<String>,

    /// Required field on commerce product category attribute record.
    pub required: bool,

    /// Searchable field on commerce product category attribute record.
    pub searchable: bool,

    /// Sort order field on commerce product category attribute record.
    pub sort_order: String,

    /// Status field on commerce product category attribute record.
    pub status: String,

    /// Tenant id field on commerce product category attribute record.
    pub tenant_id: String,

    /// Updated at field on commerce product category attribute record.
    pub updated_at: String,
}
