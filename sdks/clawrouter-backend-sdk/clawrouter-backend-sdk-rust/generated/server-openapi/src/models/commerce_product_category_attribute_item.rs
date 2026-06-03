use serde::{Deserialize, Serialize};

/// Commerce product category attribute item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductCategoryAttributeItem {
    /// Attribute id field on commerce product category attribute item.
    #[serde(rename = "attributeId")]
    pub attribute_id: String,

    /// Attribute name field on commerce product category attribute item.
    #[serde(rename = "attributeName")]
    pub attribute_name: String,

    /// Attribute no field on commerce product category attribute item.
    #[serde(rename = "attributeNo")]
    pub attribute_no: String,

    /// Category id field on commerce product category attribute item.
    #[serde(rename = "categoryId")]
    pub category_id: String,

    /// Category name field on commerce product category attribute item.
    #[serde(rename = "categoryName")]
    pub category_name: String,

    /// Category path field on commerce product category attribute item.
    #[serde(rename = "categoryPath")]
    pub category_path: String,

    /// Created at field on commerce product category attribute item.
    #[serde(rename = "createdAt")]
    pub created_at: String,

    /// Filterable field on commerce product category attribute item.
    pub filterable: bool,

    /// Id field on commerce product category attribute item.
    pub id: String,

    /// Required field on commerce product category attribute item.
    pub required: bool,

    /// Scope field on commerce product category attribute item.
    pub scope: String,

    /// Searchable field on commerce product category attribute item.
    pub searchable: bool,

    /// Sort order field on commerce product category attribute item.
    #[serde(rename = "sortOrder")]
    pub sort_order: i64,

    /// Status field on commerce product category attribute item.
    pub status: String,

    /// Updated at field on commerce product category attribute item.
    #[serde(rename = "updatedAt")]
    pub updated_at: String,

    /// Value type field on commerce product category attribute item.
    #[serde(rename = "valueType")]
    pub value_type: String,
}
