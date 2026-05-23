use serde::{Deserialize, Serialize};

/// Commerce product attribute item schema exposed by Claw Router.
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CommerceProductAttributeItem {
    /// Attribute no field on commerce product attribute item.
    #[serde(rename = "attributeNo")]
    pub attribute_no: String,

    /// Filterable field on commerce product attribute item.
    pub filterable: bool,

    /// Id field on commerce product attribute item.
    pub id: String,

    /// Name field on commerce product attribute item.
    pub name: String,

    /// Required field on commerce product attribute item.
    pub required: bool,

    /// Scope field on commerce product attribute item.
    pub scope: String,

    /// Searchable field on commerce product attribute item.
    pub searchable: bool,

    /// Status field on commerce product attribute item.
    pub status: String,

    /// Value type field on commerce product attribute item.
    #[serde(rename = "valueType")]
    pub value_type: String,
}
